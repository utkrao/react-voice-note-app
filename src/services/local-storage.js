var voiceNoteDB = (function () {

    var vnDB = {};
    var datastore = null;

    /**
     * Open a connection to the datastore.
     */
    vnDB.open = function (callback) {
        try {
            // Open a connection to the datastore.
            let request = indexedDB.open('voicenotes', 1);

            // Handle datastore upgrades.
            request.onupgradeneeded = function (e) {
                var db = e.target.result;
                e.target.transaction.onerror = vnDB.onerror;
                // Delete the old datastore.
                if (db.objectStoreNames.contains('voicenote')) {
                    db.deleteObjectStore('voicenote');
                }

                // Create a new datastore.
                var store = db.createObjectStore('voicenote', {
                    keyPath: 'timestamp'
                });
                console.log("created table", store)
            };

            // Handle successful datastore access.
            request.onsuccess = function (e) {
                // Get a reference to the DB.
                datastore = e.target.result;

                // Execute the callback.
                callback(true);
            };

            // Handle errors when opening the datastore.
            request.onerror =function(e) {
                callback(false);
            }
        } catch (error) {
            // error
        }

    };

    // fetch notes
    vnDB.fetchVoiceNotes = function (callback) {
        try {
            var db = datastore;
            var transaction = db.transaction(['voicenote'], 'readwrite');
            var objStore = transaction.objectStore('voicenote');
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = objStore.openCursor(keyRange);
            var vnNotes = [];

            transaction.oncomplete = function (e) {
                // Execute the callback function.
                callback(vnNotes);
            };

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                if (!!result == false) {
                    return;
                }
                vnNotes.push(result.value);
                result.continue();
            };
            cursorRequest.onerror = function (e) {
                callback([]);
            }
        } catch (error) {

        }
    };

    // create notes
    vnDB.createVoiceNotes = function (text, file,buffer, callback) {
        try {
            let db = datastore;
            let transaction = db.transaction(['voicenote'], 'readwrite');
            let objStore = transaction.objectStore('voicenote');
            let timestamp = new Date().getTime();
            let vnNote = {
                'note': text,
                'file': file,      
                'timestamp':timestamp,
                'id':`note_${timestamp}`,
                'buffer':buffer
            };
            let request = objStore.put(vnNote);
            request.onsuccess = function (e) {
                callback(true);
            };
            request.onerror = function (e) {
                callback(false);
            };
        } catch (error) {
            // error
        }
    };

    // delete notes
    vnDB.deleteVoiceNotes = function (id, callback) {        
        try {
            var db = datastore;
            var transaction = db.transaction(['voicenote'], 'readwrite');
            var objStore = transaction.objectStore('voicenote');

            var request = objStore.delete(id);

            request.onsuccess = function (e) {
                callback(true);
            }
            request.onerror = function (e) {
                callback(false);
            }
        } catch (error) {
            console.log("deleted",error)
            // error
        }
    };

    // Export the vnDB object.
    return vnDB;
}());


export default voiceNoteDB