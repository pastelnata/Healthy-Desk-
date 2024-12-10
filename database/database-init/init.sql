CREATE TABLE "User" (
    userid SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    height INT NOT NULL,
    mot_lvl VARCHAR(10) CHECK (mot_lvl IN ('low', 'medium', 'high')),
    avg_standing_hrs INT,
    times_moved INT,
    calories_burned INT,
    alert_streak INT,
    longest_streak INT
    );

CREATE TABLE Profile (
    profileid SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    title VARCHAR(255),
    "deskHeight" INT NOT NULL,
    timer_standing VARCHAR(255),
    timer_sitting VARCHAR(255),
    FOREIGN KEY (userid) REFERENCES "User"(userid)
);

CREATE TABLE Manager (
    managerid SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL
);

CREATE TABLE Day (
    dayid SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    date DATE NOT NULL,
    standing_hrs INT,
    times_moved INT,
    calories_burned INT,
    FOREIGN KEY (userid) REFERENCES "User"(userid)
);

INSERT INTO "User" (username, "password", email, height, mot_lvl, alert_streak, longest_streak) VALUES 
    ('user1', 'password1', 'user1@gmail.com', 180, 'low', 21, 32);
    

INSERT INTO "Manager" (email, username, "password") VALUES 
    ('user2@gmail.com', 'user2', 'password2');
