const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const twilio = require('twilio');
const accountSid = 'ACd7bc4eb3e522e8e21dfbcf0d2656707c';
const authToken = 'd1242363d6e089ae9479302a4673ce5d';
const client = new twilio(accountSid, authToken);

let MessageSchema = new mongoose.Schema({
  phoneNumber: String
  //eventually capture the address...addressName: String
})

let Message = mongoose.model('Message', MessageSchema);

app.use(bodyParser.urlencoded({extended: false}))
mongoose.connect('mongodb://isaac:123@ds135540.mlab.com:35540/occupi-chat-db', {useMongoClient:true})
.then(() => {
  console.log('db connected brrrrrrrrap');
})


app.get('/', (req, res) => {
    res.end();
})

app.post('/inbound', (req, res) => {
  let from = req.body.From;
  let to = req.body.To;
  let body = req.body.Body;
  
  Message.find({phoneNumber: req.body.From}, (err, message) => {
    if(message.length !== 0) {
      // we need to continue the convo
      
      if(body === "290 Harman st" || "290 Harman St" || "290 harman st" ||  "290 Harman Street" || "290 harman street") {
        Message.findByIdAndUpdate(message[0]._id, {"$set": {"addressName": body}}, {"new":true, "upsert": true}, () => {
          client.messages.create({
            to: `${from}`,
            from: `${to}`,
            body: 'Ok great!!!!!! that apartment is still available. Click on this link and buy jon a beer.  '
          })
          res.end()
        })
      } else if(body !== "290 Harman st" || "290 Harman St" || "290 harman st" ||  "290 Harman Street" || "290 harman street") {
        Message.findByIdAndUpdate(message[0]._id, {"$set": {"addressRented": body}}, {"new":true, "upsert": true}, () => {
          client.messages.create({
            to: `${from}`,
            from: `${to}`,
            body: 'Oh man, that apartment got rented bud. But since im occubot master fresh, ill still help you out. Check out this link.and do stuff.  '
          })
          
          res.end()
        })
      }
      
    } else {
      if(body === "Showing" || "SHOWING" || "showing") {
        let newMessage = new Message(); 
        newMessage.phoneNumber = from;
        newMessage.save(() => {
          client.messages.create({
            to: `${from}`,
            from: `${to}`,
            body: 'Hey this is occub0tMasterFreshYo. Please text me the address of the apartment that you would like to see. '
          })
          
          res.end();
        })
      }
    }
      
          res.end();  
        })
      })
   
    


app.listen(3000, () => {
  console.log('server connected yaaaaaaay');
})