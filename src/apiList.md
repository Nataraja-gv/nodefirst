 # devtinder apis

 ## authRouter
 -POST /signup
 -POST /login
 -Post /logout

 ## profileRouter
 -GET /profile/view
 -PATCH /profile/edit
 -PATCH /profile/password

 ### connectionRequestRouter
 -POST /request/send/:status/:userId
 -POST /request/review/:status/:userId

 
## userRouter
 --GET /user/connections
 -GET /user/requests/received
 -GET /user/feed -gets you the profile of other users on platform

