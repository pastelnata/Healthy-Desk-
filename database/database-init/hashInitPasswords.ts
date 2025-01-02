import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

// Use absolute path
const sqlFilePath = path.join(__dirname, '../database-init/init.sql');

console.log('Starting password hashing process...');

try {
  // Read the SQL file
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
  console.log('Original SQL file read successfully.');

  // Define regex for matching "password" fields
  const userPasswordRegex = /INSERT INTO "User" .*?VALUES\s*\(([^;]+)\);/gs;
  const managerPasswordRegex = /INSERT INTO "Manager" .*?VALUES\s*\(([^;]+)\);/gs;

  // Hashing
  const saltRounds = 10;
  let userPasswordsCount = 0;
  let managerPasswordsCount = 0;

  function hashPasswordsInBlock(sql: string, regex: RegExp, isUser: boolean): string {
    return sql.replace(regex, (blockMatch: string, valuesBlock: string): string => {
      const updatedValuesBlock = valuesBlock
        .split('),')
        .map((row: string): string => {
          let fieldIndex = 0;
          return row.replace(/'([^']+)'/g, (match: string, fieldValue: string): string => {
            fieldIndex++;
            if (fieldIndex === 2) {
              const hashedPassword = bcrypt.hashSync(fieldValue, saltRounds);
              isUser ? userPasswordsCount++ : managerPasswordsCount++;
              return `'${hashedPassword}'`;
            }
            return match;
          });
        })
        .join('),');

      return blockMatch.replace(valuesBlock, updatedValuesBlock);
    });
  }

  // Process user and manager passwords
  let updatedSql = hashPasswordsInBlock(sqlContent, userPasswordRegex, true);
  updatedSql = hashPasswordsInBlock(updatedSql, managerPasswordRegex, false);

  console.log(`Processed ${userPasswordsCount} user passwords.`);
  console.log(`Processed ${managerPasswordsCount} manager passwords.`);

  // Save updated SQL file
  fs.writeFileSync(sqlFilePath, updatedSql, 'utf-8');
  console.log(`Updated SQL file with hashed passwords saved to: ${sqlFilePath}`);
} catch (error) {
  // Check if `error` has a `message` property
  if (error instanceof Error) {
    console.error('Error during password hashing process:', error.message);
  } else {
    console.error('Unknown error occurred during password hashing process:', error);
  }
}