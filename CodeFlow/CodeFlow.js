/*

CODE FLOW OF THE SERVER CODE ->>>>>>>>>(Lec-1)

Step 1 : Creating Index File and request apis
Step 2: Created auth router and post router 
Step3 : created the auth Controller and post Controller
Step4 : In Auth Controller we created function of the singup Controller, login Controller ,refreshTokenController
Step5 : SignUp and Login Controller will handle the login and sign up in server 
Step 6: We have post controller which will show the posts 
Step 7: we want that user get to see the post only when they have access token else not, for that we have created middleware (requireUser) that will check that user user have valid token or not and if yes then show posts (call the postController)
Step 8: we have created two internal function to create access token and refresh token
Step 9: Refresh token will create the access token when it expires so that hacker wont hack the access token as it will be changing (all this will be controlled in the refreshTokenController)
Step 10: Access token will be stored in the local storage while refresh token in the cookies 


ISSUES ->> The refresh key is not getting generated         (!cookeies.jwt) error  


CODE FLOW OF REACT CLIENT CODE ->>>>>>>>(Lec-2)

Step1 : First we created Login And SignUp pages and desined it 
Step2 : Now For calling Apis we used axios and created axios client file
Step 3 : We created Axios cLient which will take the base Url and call the further apis 
Step 4 : In Axios Client file we created the two Intercepters for request and response
Step 5: We created a local storage to store access key
Step 6 : in Request interceptor, We passed the access key in the header of request into the backend
Step 7: In Response Interceptor, We  will first Check the response if the response have status ok then return the data
Step 8 : then if the response have 401 error and error is due to expiration of refresh key then remove the access key from local storage and send user to login page
Step 9: if the response have only 401 error means access token is expired now so we have to call the refresh api to regenerate the acess token
and if the response of refresh api have status ok then store the access key in the local storage anf  just pass the new generated access token in the header of originalRequest which was called first and recall it 
Step 10 : then stored the server base URL into the .env file so it can be changed anytime



Lec-3&4
Step1 :In this lecture we Created many api calls, all are mentioned in the each controller in Routers
Step2: Changed the User and Post Schema with Additional Information
Step3 : In Doubt session we created more apis in the backend


Lec-5 
Step1: In whole lecture completely focused on the frontend design , and Designed HTML And CSS of components Like Navbar,Profile,Post,Followers,Feed, Create Pos And Update Profile 

Lec-6 
Step1: Here We started connecting our frontend with backend 
Step1: Firstly we Created a Redux in which we created store and appConfigSlice 
*/

