const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const body = 'EOS Emergency - Please see Keybase';

const producerNumbers = {};
producerNumbers["eoscanadacom"] = "+447725277831";
producerNumbers["eosnewyorkio"] = null;
producerNumbers["starteosiobp"] = "+447725277831";
producerNumbers["eoshuobipool"] = null;
producerNumbers["bitfinexeos1"] = null;
producerNumbers["libertyblock"] = null;
producerNumbers["eos42freedom"] = null;
producerNumbers["zbeosbp11111"] = null;
producerNumbers["eoslaomaocom"] = null;
producerNumbers["eosswedenorg"] = null;
producerNumbers["eosauthority"] = null;
producerNumbers["eosisgravity"] = null;
producerNumbers["eosriobrazil"] = null;
producerNumbers["eosdacserver"] = null;
producerNumbers["helloeoscnbp"] = null;
producerNumbers["eosbixinboot"] = null;
producerNumbers["argentinaeos"] = null;
producerNumbers["teamgreymass"] = null;
producerNumbers["eosamsterdam"] = null;
producerNumbers["eosasia11111"] = null;
producerNumbers["eosbeijingbp"] = null;
producerNumbers["eoscafeblock"] = "+447725277831";

var request = require('request');
var rp = require('request-promise');
var options = { method: 'GET',
  url: 'http://nodes.eos42.io/v1/chain/get_producers',
  body: { json: 'true', limit: '21' },
  json: true };
var activeNumbers = [];
var activeProducers = {};

rp(options, function (error, response, body) {
  if (error) throw new Error(error);

for(var key in body["rows"])
{
  var producerName = body["rows"][key]["owner"];
  if(producerNumbers[producerName] != null){ 
    activeNumbers.push(producerNumbers[producerName]);
    activeProducers[producerNumbers[producerName]] = producerName;
  }

}

}).then(function(){

Promise.all(
      activeNumbers.map( number => {
      twilio.messages.create({
        to: number, 
        from: process.env.TWILIO_MESSAGING_SERVICE_SID,
        body: body 
        }).then(console.log("BP: " + activeProducers[number] + " Alerted"));
    })
).then( message => console.log("Number of BPs Alerted: " + activeNumbers.length ))
      .catch( err => console.log(err));


})
.catch(function(err){
  console.log("Request Failed. Unable to alert Producers: " + err);
});

