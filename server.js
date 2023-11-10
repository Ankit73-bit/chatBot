const { NlpManager } = require("node-nlp");
const cors = require("cors");
const express = require("express");

const {
  botStartConversation,
  botEndConversation,
  botIntro,
  botAboutCompnay,
  botAnserServices,
  botDigitalRes,
  botDetailInfoDigital,
} = require("./data/botData.js");

const {
  userEndConversation,
  userStartConversation,
  userAskToIntro,
  userAboutCompany,
  userQuestionService,
  userDigitalQue,
  userDigitalInfoque,
} = require("./data/userData.js");

const app = express();
app.use(cors());

const manager = new NlpManager({ languages: ["en"], forceNER: true });

// Add User response
function addUserResponse(language, userResponse, intent) {
  for (const conversation of userResponse) {
    manager.addDocument(language, conversation, intent);
  }
}

// Add bot response
function addBotResponse(language, intent, botResponse) {
  for (const conversation of botResponse) {
    manager.addAnswer(language, intent, conversation);
  }
}

// User responses
addUserResponse("en", userStartConversation, "greeting");
addUserResponse("en", userEndConversation, "bye");
addUserResponse("en", userAskToIntro, "botIntroduce");
addUserResponse("en", userAboutCompany, "aboutCompany");
addUserResponse("en", userQuestionService, "aboutServices");
addUserResponse("en", userDigitalQue, "digital");
addUserResponse("en", userDigitalInfoque, "digitalDetailInfo");

// Bot responses
addBotResponse("en", "greeting", botStartConversation);
addBotResponse("en", "bye", botEndConversation);
addBotResponse("en", "botIntroduce", botIntro);
addBotResponse("en", "aboutCompany", botAboutCompnay);
addBotResponse("en", "aboutServices", botAnserServices);
addBotResponse("en", "digital", botDigitalRes);
addBotResponse("en", "digitalDetailInfo", botDetailInfoDigital);

// ----------------------------------------------------------------
(async () => {
  await manager.train();
  manager.save();

  // route and handler
  app.get("/", async (req, res) => {
    const response = await manager.process("en", req.query.message);
    res.status(200).json({
      status: "success",
      answer: response.answer,
    });
  });

  app.listen(8080, () => {
    console.log(`Server is listning to the port ${8080}`);
  });
})();
