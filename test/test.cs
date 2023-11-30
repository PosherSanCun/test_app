using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        await TestGetRequest();
        // await TestPostRequest();
    }

    //Get请求测试
    static async Task TestGetRequest()
    {
        using (HttpClient client = new HttpClient())
        {
            string apiUrl = "https://yssd-4g1i324sed69c25d-1257039181.ap-shanghai.app.tcloudbase.com/test2"; // 示例 API 地址
            string param1 = "value1";
            string param2 = "value2";

            string urlWithParams = $"{apiUrl}?param1={param1}&param2={param2}";
            HttpResponseMessage response = await client.GetAsync(urlWithParams);

            if (response.IsSuccessStatusCode)
            {
                string result = await response.Content.ReadAsStringAsync();
                Console.WriteLine("GET Request Result:");
                Console.WriteLine(result);
            }
            else
            {
                Console.WriteLine($"GET Request Failed: {response.StatusCode}");
            }
        }
    }

    static async Task TestPostRequest()
    {
        using (HttpClient client = new HttpClient())
        {
            string apiUrl = "https://jsonplaceholder.typicode.com/posts"; // 示例 API 地址

            // 构造 POST 请求的内容
            var postData = new { title = "Test Post", body = "This is a test post.", userId = 1 };

            HttpResponseMessage response = await client.PostAsJsonAsync(apiUrl, postData);

            if (response.IsSuccessStatusCode)
            {
                string result = await response.Content.ReadAsStringAsync();
                Console.WriteLine("POST Request Result:");
                Console.WriteLine(result);
            }
            else
            {
                Console.WriteLine($"POST Request Failed: {response.StatusCode}");
            }
        }
    }
}
