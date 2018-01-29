function onResult(event) {
  console.log('onresult');
  for (var i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      var msg = event.results[i][0].transcript;
      console.log('msg='+msg);
      try{if(!STOP)window.recognition.start();}catch(e){}
      sendMessage(msg);
    }
  }
}

function onLoad(){
  window.speechSynthesis.getVoices();
  window.recognition = new webkitSpeechRecognition();
  //startSR();
  recognition.onresult = onResult;
  window.STOP = false;
  setTimeout("init()",1000);
}

function init(){   
  console && console.clear && console.clear()
  var voices = speechSynthesis.getVoices();
  for(var i=0;i<voices.length;i++){
    if(voices[i].name == "Samantha"){
      window.VOICE = voices[i];
      break;
    }
  }

  var rs;
  loadBot("chatbot.txt");
}

function loadBot(botUrl) {
  rs = new RiveScript()
  rs.loadFile([botUrl], on_load_success, on_load_error);
}

function on_load_success() {
  rs.sortReplies();
  getReply("start");
}

function on_load_error(err) {
  startSR(
    "Yikes, there was an error loading this bot. Refresh the page please."
  );
  console.log("Loading error: " + err);
}

function sendMessage(text) {
  if (text.length === 0) return false;
  
  getReply (text);
  return false;
}

function getReply (text) {
  try {
    var reply = rs.reply("soandso", text);
    var utterance = new SpeechSynthesisUtterance(reply);
    utterance.voice = window.VOICE;
    utterance.voiceURI = 'Samantha';
      utterance.onend = startSR;
    window.speechSynthesis.speak(utterance);
    console.log('recog started')
    
  } catch (e) {
    startSR(e.message + "\n" + e.line);
    console.log(e);
  }
}

function startSR(reply,delay) {
    reply = (reply && typeof reply == "string")?reply:"";
    try{
      if(reply.indexOf("I think size M") != -1){
        window.STOP = true;
        window.recognition.stop();
        console.log('stopping recog')
      }else{
        window.recognition.start()
      }
    }catch(e){console.log(e)};
}
