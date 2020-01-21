import SQLite from 'react-native-sqlite-2';
//const SQLite = require('react-native-sqlite-2')
const dataBaseName = 'CYPHER_CONTACT_MANAGER_DATABASE.db'
const database_version = '1.0'
const database_displayname = 'Contact manager Database'
const database_size = 200000;
let db: any;



export const DBOps = {

    openDB: (successCB, errorCB) => {
        db = SQLite.openDatabase({ name: dataBaseName, createFromLocation: "~CONTACT_DATABASE.db" }, successCB, errorCB);
    },

    createContactTable: (contactObj, callback) => {
        debugger;
        db.transaction((txn) => {
            //  txn.executeSql('DROP TABLE IF EXISTS AddContact', []);

            txn.executeSql('CREATE TABLE IF NOT EXISTS AddContact(user_id INTEGER PRIMARY KEY NOT NULL, title VARCHAR(8), name VARCHAR(50), phone VARCHAR(15),dateOfBirth VARCHAR(15),email VARCHAR(20), profileImage text)', []);
            txn.executeSql('INSERT INTO AddContact (title,name,phone,dateOfBirth,email,profileImage) VALUES (:title,:name,:phone,:dateOfBirth,:email,:profileImage)', [contactObj.contactTitle, contactObj.contactName, contactObj.contactPhone, contactObj.contactDoB, contactObj.contactPersonal, contactObj.contactProfileImage], function (tx, res) {
                console.log(res)
                callback(true)
            }, function (tx, res) {
                console.log(res)
                callback(false);
            });
        });

    },

    getAllcontacts: (CB) => {

        let contactArray: any = [];
        db.transaction(function (txn) {

            txn.executeSql('SELECT * FROM AddContact', [], function (tx, res) {
                if (res.rows.length > 0) {

                    // CB(res.rows)

                    for (let i = 0; i < res.rows.length; ++i) {
                        contactArray.push(res.rows.item(i));
                        if (i == res.rows.length - 1) {
                            CB(contactArray)
                        }
                    }
                } else {
                    CB(false)
                }
            }, function (tx, error) {
                CB(false);
                console.log('error:', JSON.stringify(error));
            });
        });
    },

    updateContactTable: (contactObj, CB) => {
        debugger;
        console.log('Update Query: ', 'UPDATE AddContact SET title="' + contactObj.contactTitle + '", name="' + contactObj.contactName + '", phone="' + contactObj.contactPhone + '", dateOfBirth="' + contactObj.contactDoB + '", email="' + contactObj.contactPersonal + '", profileImage="' + contactObj.contactProfileImage + '" WHERE user_id ="' + contactObj.contactUserId + '"');


        db.transaction((txn) => {
            txn.executeSql('UPDATE AddContact SET title="' + contactObj.contactTitle + '", name="' + contactObj.contactName + '", phone="' + contactObj.contactPhone + '", dateOfBirth="' + contactObj.contactDoB + '", email="' + contactObj.contactPersonal + '", profileImage="' + contactObj.contactProfileImage + '" WHERE user_id ="' + contactObj.contactUserId + '"', (tx, res) => {
                CB(res);
            }, (txn, error) => {
                CB(error);
            });
        });

    },


}
