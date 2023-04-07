const { log } = require("debug/src/browser");
const { Configuration, OpenAIApi } = require("openai");
const config = new Configuration({
    apiKey: process.env.OPENAIAPI
});
const openai = new OpenAIApi(config);

module.exports = {
    runPrompt : async (data) => {

        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: data,
          max_tokens: 2048,
          temperature: 1,
    
        });
          const parsableJSONresponse = response.data.choices[0].text;
          const JsonString = JSON.stringify(parsableJSONresponse)
          var parsedResponse = JSON.parse(JsonString);

        var ans = parsedResponse;
        return new Promise((resolve,reject) => {
            resolve(ans);
        })
      }
}
