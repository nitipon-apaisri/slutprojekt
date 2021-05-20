# Inge Bra Bygg

### Env Files
``` 
Shall be put in the root /config folder.
```
**Development File**

- .dev.env

**Example .dev.env file**
``` 
JWT_SECRET=mysecret
NODE_ENV=dev
PORT=5000
IMAGE_URL=http//localhost:PORT/static ( PORT will be auto magic replaced!)
```
- More information can be found in the Trello-board on the Server Configure card in column Project

### Run scripts
``` 
npm run dev - starts development server
```

### Testing
- Request collection can be found in the Trello-board on the card Testing in column Project
- Follow the instructions to access all requests for testing

### Database Entities
- User
- Task
- Message
- ErrorReport

### Endpoints

**Generic endpoints**

| Method  | Path    | Requested info                                           | Role   | Response                  |
| ------- | ------- | -------------------------------------------------------- | ------ | ------------------------- |
| POST    | `/auth` | body: `{ username, password }`                           | none   | `{ message, token }` |
| GET     | `/me`   | --                                                       | all    | `data: { User, tasks: [ { Task, Message[], ErrorReport[] } ] }` |
| PATCH   | `/me`   | body: `{ username?, password?, profile?: { anything } }` | all    | `{ message }` |

**Users endpoints**

| Method  | Path         | Requested info                                                           | Role          | Response           |
| ------- | ------------ | ------------------------------------------------------------------------ | ------        | ------------------- |
| GET     | `/users`     | query: role (search for user role), search (search by username)          | admin, worker | `{ data: User[] }` |
| POST    | `/users`     | body: `{ username, password, role? }`                                    | admin         | `{ message }`      |
| GET     | `/users/:id` | --                                                                       | all           | `{ data: User }`   |
| PATCH   | `/users/:id` | body: `{  username?, password?, profile?: { anything }, role?  }`        | admin         | `{ data: User }`   |
| DELETE  | `/users/:id` | --                                                                       | admin         | `{ message }`      |

**Tasks endpoints**

| Method  | Path                          | Requested info                                                         | Role           | Response          |
| ------- | ----------------------------- | ---------------------------------------------------------------------- | ------         | ----------------- |
| GET     | `/tasks`                      | query: filter (search for done or all), search (search by client name) | worker, client | `{ Task[] }`          |
| POST    | `/tasks`                      | body: `{ title, info, clientId }`                                      | worker         | `{ message }`     |
| GET     | `/tasks/:id`                  | --                                                                     | worker, client | `{ Task }`        |
| PATCH   | `/tasks/:id`                  | body: `{  title?, info?, clientId?, completed? }`                      | worker         | `{ message }`     |
| DELETE  | `/tasks/:id`                  | --                                                                     | admin          | `{ message }`     |
| POST    | `/tasks/:id/image`            | multipart-form: imageUpload (.jpg, .jpeg, .png)                        | worker         | `{ message, data: imageUrl }` | 
| GET     | `/tasks/:id/messages`         | query: limit (number), page (number)                                   | worker, client | `{ Message[] }`   |
| DELETE  | `/tasks/:id/messages/:msg_id` | --                                                                     | worker, client | `{ message }`     |
