#r "Newtonsoft.Json"
using System.Net;
using System.Net.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log, dynamic inputDocument)
{
    string step = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "step", true) == 0)
        .Value;

    if(step == null){
        log.Info("in first step");
        return req.CreateResponse(
            HttpStatusCode.OK, 
            new {nextcall = new {
                    body = new { title = "$album.Title"},
                    function = "&step=replace"}
            },
            System.Net.Http.Formatting.JsonMediaTypeFormatter.DefaultMediaType
        );
    }
    if(step == "replace"){
        log.Info("in replace step");
        dynamic data = await req.Content.ReadAsAsync<object>();
        var title = data?.title.ToString();
        title = String.Join("+", title.Split(' '));
        log.Info(title);
        //Get a cached cover image in Azure DocumentDB
        string value = (from image in (JArray) inputDocument.images 
            where image["title"].ToString() == title 
            select image["url"].ToString()).FirstOrDefault();

        if (value == null){ // Search a cover image from Bing
            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri("https://api.cognitive.microsoft.com/bing/v5.0/images/search");
            client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "<YOUR BING API KEY");
            HttpResponseMessage response = await client.GetAsync("?q=" + title);
            string images = await response.Content.ReadAsStringAsync();
            var o = JObject.Parse(images);
            value = o["value"][0]["contentUrl"].ToString();
            var original = inputDocument.images;
            original.Add(JToken.FromObject(new {title = title, url = value}));
            inputDocument.images = original;
            // logs the original search result just for fun...
            var logs = inputDocument.logs;
            logs.Add(o["value"][0]);
            inputDocument.logs = logs;
        }
        else
            log.Info("I'm using a cached url to save your bing query quota");       

        var result = new{
            context = new { 
                str_url = value,
                _void =  "SET $album.AlbumArtUrl = $str_url"
            },
            returnx = "View($album)"
        };
        return req.CreateResponse(
            HttpStatusCode.OK, 
            result,
            System.Net.Http.Formatting.JsonMediaTypeFormatter.DefaultMediaType
        );  
    }
    return req.CreateResponse(HttpStatusCode.BadRequest, "invalid step");
}
