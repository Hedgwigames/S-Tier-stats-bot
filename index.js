import {google} from "googleapis";
import { Client, GatewayIntentBits, Routes } from "discord.js";
import {config} from "dotenv";
import {REST} from "@discordjs/rest";
import { read } from "fs";

config();



const client = new Client({ intents: ["Guilds", "GuildMessages"]});
const TOKEN = process.env.BOT_TOKEN;
const rest = new REST({version: "10"}).setToken(TOKEN)
const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID

const auth = new google.auth.GoogleAuth({
  keyFile: "keys.json", //the key file
  //url to spreadsheets API
  scopes: "https://www.googleapis.com/auth/spreadsheets", 
});
const authClientObject = await auth.getClient();
const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
const spreadsheetId = "1uy6KL6L0g7LNPHdNfm3ggtWNFwA9yN-xJqQC605S4cA";

//send the data reae with the response

client.login(TOKEN);


client.on("ready", () =>{
    console.log(`${client.user.tag} is online`)
})

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()){
    const readAvgScore = await googleSheetsInstance.spreadsheets.values.get({
      auth, //auth object
      spreadsheetId, // spreadsheet id
      range: "AVERAGE SCORE - OVERALL!A3:C986", //range of cells to read from.
    })
    const readTotalScore = await googleSheetsInstance.spreadsheets.values.get({
      auth, //auth object
      spreadsheetId, // spreadsheet id
      range: "TOTAL SCORE - OVERALL!A3:C986", //range of cells to read from.
    })
    const readAvgPlace = await googleSheetsInstance.spreadsheets.values.get({
      auth, //auth object
      spreadsheetId, // spreadsheet id
      range: "AVERAGE PLACEMENT!A3:C986", //range of cells to read from.
    })
    
    let avgScorePlace = 0
    let avgPlacePlace = 0
    let totalScorePlace = 0
    let avgScore = 0
    let ign = interaction.options.getString("ign")
    ign = ign.toLowerCase();
    var loopCountAvg = -1
    let ignCheckAvg = ""
    let foundAvg = false
    let ignOutput = ""
    while (ignCheckAvg != ign){
      loopCountAvg = loopCountAvg+1
      ignCheckAvg = readAvgScore.data.values[loopCountAvg][1]
      ignCheckAvg = ignCheckAvg.toLowerCase();
      ignOutput = readAvgScore.data.values[loopCountAvg][1]
      if (ignCheckAvg == ign){
        avgScore = readAvgScore.data.values[loopCountAvg][2]
        foundAvg = true
        avgScorePlace = readAvgScore.data.values[loopCountAvg][0]
      }
      if (loopCountAvg == 900){
        interaction.reply({content: "You are not on the leaderboards!"})
        break;
      }
    }
    let totalScore = 0
    var loopCountTotal = -1
    let ignCheckTotal = ""
    let foundTotal = false
    while (ignCheckTotal != ign){
      loopCountTotal = loopCountTotal+1
      ignCheckTotal = readTotalScore.data.values[loopCountTotal][1]
      ignCheckTotal = ignCheckTotal.toLowerCase();
      if (ignCheckTotal == ign){
        totalScore = readTotalScore.data.values[loopCountTotal][2]
        foundTotal = true
        totalScorePlace = readTotalScore.data.values[loopCountTotal][0]
      }
      if (loopCountTotal == 900){
        break;
    }
    let avgPlace = 0
    var loopCountPlace = -1
    let ignCheckPlace = ""
    let foundPlace = false
    while (ignCheckPlace != ign){
      loopCountPlace = loopCountPlace+1
      ignCheckPlace = readAvgPlace.data.values[loopCountPlace][1]
      ignCheckPlace = ignCheckPlace.toLowerCase();
      if (ignCheckPlace == ign){
        avgPlace = readAvgPlace.data.values[loopCountPlace][2]
        foundPlace = true
        avgPlacePlace = readAvgPlace.data.values[loopCountPlace][0]
      }
      if (loopCountPlace == 900){
        break;
    }
  }

        
    if (foundAvg == true && foundTotal == true && foundPlace == true)   {
      interaction.reply({ content: `IGN: ${ignOutput}\nAverage score: ${avgScore} (#${avgScorePlace})\nTotal score: ${totalScore} (#${totalScorePlace})\nAverage placement: ${avgPlace} (#${avgPlacePlace})`})
    }

    

  }
  }
  });
async function main () {
    const commands = [{
      
      name: "stats",
      description: "Flex your tournament stats!", 
      options: [{
        name: "ign",
        description: "Your minecraft IGN",
        type: 3,
        required: true,
      }],
      
    }]
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  };
  main();