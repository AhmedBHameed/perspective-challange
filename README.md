# perspective-challange

Node.js challange for perspective company.

## How to run

- Docker is recommended.
- `sudo docker-compose -f docker-compose.yml up` is development environment

- When server running, you will see a log similar to this

```
perspective_1  | 	🛡️ ###########################🛡️
perspective_1  |
perspective_1  | 	 Server is listening to:
perspective_1  |
perspective_1  | 	 🚀 http://[CONTAINER IP]:5000
perspective_1  |
perspective_1  | 	 🔨 Build ver: 1.0.0
perspective_1  |
perspective_1  | 	 📳 Development mode
perspective_1  |
perspective_1  | 	🛡️ ###########################🛡️
```

# APIs

- `/api/v1/funnel` for fetching funnel.
- `/api/v1/mutate-session` for posting new session.

# SERVICES:

This applications comes with few helpful services that ease our life. Services are:

- Mongo-express is a web based mongo database management tool that can be accessed via `http://localhost:8888/`
- Redis commander is a redis web based interface for redis operations. Can be accessed via `http://localhost:8081`
- Bull-dashboard is a web based interface for Bull.js that can be accessed via `http://localhost:5000/admin/queues`

# Q&A

_I'm going to explain few theories about requirements and discuss my thoughts also. Let's get started._

> **A1.1:** There can be multiple worker running with your code

**We added 4 workers here**

> **A1.2:** ..., meaning that if two jobs from the same session are in the queue and the sessions isn't saved on the DB yet, it could occur that you create two sessions instead of one

**We consider `jobId` is a combination of `[pageId]:[sentAt]`. Each job should be debounced before sent to the queue. With that way, we insure that only one (last updated) job related to `pageId` is running in worker.**

I can see that it is part of the `enhancement` in this [issue#1034](https://github.com/OptimalBits/bull/issues/1034). The community called this issue `debounce job` in title. Since this feature is not implemented yet AFAIK, I followed another article [here](https://mohitkarekar.com/posts/2020/debouncing-queue/) for implementation.

Implementation steps are:

1. Check if new job is exist in redis or not.
2. If exists, update the job using the same pageId.
3. Before pushing a new job to the queue, we add a small amount of delay.
4. Any new job comes during the delay time (with the same pageId), the new job replace with the old. That means the new job is an update for the previous one.
5. When done, return the result to the client.

_PS: Those jobs are stored in redis directly and not inside the queue. Till they are ready to process (elapse the time delay of the debounce function), we send it to the queue._

> **A2:** All job data is coming from a funnel. Meaning all data is generated in a frontend runtime

**The route for posting data is `/api/v1/mutate-session` which means that a post request must be applied to the server. We made our queue return the data to respond back with the new/updated data that occure on database including database \_id**

TBH, not sure if that means that the assignment wants me to implement a front-end to make the call? but i would not bother myself since we just need to use a 3rd party tool to make RESTful API call.

Please use this example in case you want to test the result on runtime:

**Async call**

```bash
POST /api/v1/mutate-session {"Content-Type": "application/json"}
```

**Payload example**

```json
{
  "timestamp": "2021-06-07T08:32:07.546Z",
  "sentAt": "2021-06-07T08:32:29.547Z",
  "properties": {
    "trackingVersion": "v3",
    "clientSessionId": "AFfmr1iGvkrJXxKWid9Ih",
    "clientPersistentId": "W3hi37-xp--9_pG1jkwIz",
    "pageId": "609a878b0cba83001fb5abd7",
    "companyId": "5fb4eb1a839d81001f800c22",
    "campaignId": "609a878b0cba83001fb5abd2",
    "versionId": "60a4c19fcf963b001f9f286e",
    "optIns": [
      {
        "fieldName": "fullName",
        "label": "Full Name",
        "value": "Ahmed HAMEED"
      },
      {
        "fieldName": "email",
        "label": "Business Email",
        "value": "christoph@perspective.co"
      }
    ]
  },
  "messageId": "perspective-q6qmW8wlPgRwJo1JOB1Yz8"
}
```

> **A3:** The same job can be send multiple times, we follow a "at least once" policy in the queue

If i understand that correctly then:

**By using `jobId`, jobs will be unique and executed once via the worker. Any duplicate jobId will be responded from the cache directly. and since we are using `sentAt` as part of the `jobId` combination, we assume each job should be unique unless the network tries to play with us :)**

> **A4:** The optIn part in the job is variable, it can be up to 10 items in there - there can't be a fieldName twice in one optIn list though

**When end-point `/api/v1/mutate-session` called, the fist thing to do is to validate the data coming from the client. The validation is very precise and can trigger error when "optIns" has duplicate fields in `fieldName`. We use @hapi/joi library to help us with validations.**

> **A5:** `clientSessionId` is generated as soon as a funnel loads. It isn't saved on the client and is created on runtime

**I guess `clientSessionId` is part of another `user` document. However, we are going to mock it with auto generated id on each visit to the end-point `/api/v1/funnel`**

> **A6:** `clientPersistentId` is generated the first time a user visits a funnel and will be saved as persistent cookie

**I guess `clientPersistentId` is part of another `Authentication` system. However, we are going to mock it with `objectID` data to prevent any complication. This token will be controlled by cookies with `httpOnly` flag set to `true` to prevent cookies accessibility in front-end. If a new request comes with cookies that has `clientPersistentId`, we pass overwriting the cookies**

# Testing

To run testing we need to run redis server first. We count on `docker` to male the test. This does not make sense to me because unit test should be independent but seems mocking `redis` functionality is too way complicated.

So let us make it short.

- run redis server from `docker-compose.yml` file.
- execute `yarn test:debug` which run the test with watch mode.

# Conclusion

_So while searching for some discussion about testing Bull.js, I found `nust.js` is already support `@nust-bull` library. It might be easier with unit test but there is no time to fallback from express. Another reason is that i did not use `nuxt.js` so that would be extra time and complexity to thing about. However, I'm also happy to wreck the test using express.js_
