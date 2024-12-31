import fs from 'fs';
import bcrypt from 'bcrypt';

//file paths
const sqlFilePath = '../database-init/init.sql';
const outputFilePath = '../database-init/init_hashed.sql';

console.log('Starting password hashing process...');

//read the SQL file
const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
console.log('Original SQL file read successfully.');

//define regex for matching "password" fields only (for user & manager)
const userPasswordRegex = /INSERT INTO "User" .*?VALUES\s*\(([^;]+)\);/gs;
const managerPasswordRegex = /INSERT INTO "Manager" .*?VALUES\s*\(([^;]+)\);/gs;

//hashing
const saltRounds = 10;

//counter to check how many user and manager passwords were hashed
let userPasswordsCount = 0;
let managerPasswordsCount = 0;

function hashPasswordsInBlock(sql: string, regex: RegExp, isUser: boolean): string {
  return sql.replace(regex, (blockMatch: string, valuesBlock: string): string => {
    //each row in the block processing
    const updatedValuesBlock = valuesBlock
      .split('),')
      .map((row: string): string => {
        let fieldIndex = 0;
        return row.replace(/'([^']+)'/g, (match: string, fieldValue: string): string => {
          //only hash the password field (second)
          fieldIndex++;
          if (fieldIndex === 2) {
            const hashedPassword = bcrypt.hashSync(fieldValue, saltRounds);
            if (isUser) {
              userPasswordsCount++;
            } else {
              managerPasswordsCount++;
            }
            return `'${hashedPassword}'`;
          }
          return match;
        });
      })
      .join('),');

    return blockMatch.replace(valuesBlock, updatedValuesBlock);
  });
}

//Process user passwords 
let updatedSql = hashPasswordsInBlock(sqlContent, userPasswordRegex, true);
console.log(`Processed ${userPasswordsCount} user passwords.`);

//process manager passwords
updatedSql = hashPasswordsInBlock(updatedSql, managerPasswordRegex, false);
console.log(`Processed ${managerPasswordsCount} manager passwords.`);

//Save the updated SQL to a new file (init_hashed.sql file)
fs.writeFileSync(outputFilePath, updatedSql, 'utf-8');
console.log(`Updated SQL file with hashed passwords saved to: ${outputFilePath}`);








