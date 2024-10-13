const private_key = require('./serviceAccountKey.json');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(private_key),
});

const sendNotification = async (tokens, req, res) => {
  const messageSend = {
    tokens,
    notification: {
      title: req.body.title,
      body: req.body.description,
    },
    data: {
      key1: "value1",
      key2: "value2",
    },
  
    android: {
      priority: "high"
    },
    apns: {
      payload: {
        aps: {
          badge:42
        }
      }
    }
  };
  await admin.messaging().sendEachForMulticast (messageSend).then(response => {
     
    console.log("Successfully sent message: ", response);
    res.status(201).json({ message: 'success', data: response });
    
    if(response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, index) => {
        if(!resp) {
          failedTokens.push(tokens[index]);
        }
      });
      console.log("List of failed tokens : " + failedTokens);
    }
    
  })
  .catch(error => {
    console.log("Error sending message: ", error);
    return res.status(400).json({ message: 'failed', data: error});
  });
};

module.exports = {
    notifyUser: async (req,res) => {  
     
      const registrationTokens = req.body.registrationTokens;
      // Check if each object has a 'token' field
      const tokens = registrationTokens.map(tokenObj => {
        if (!tokenObj.token) {
          throw new Error("Missing token field in one of the objects.");
        }
        return tokenObj.token;
      });

      
      await sendNotification(tokens, req, res); // Await the async function
    }
}