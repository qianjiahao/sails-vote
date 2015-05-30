# sails-vote

##投票/问卷系统

###Permission：
 - normal user
 - admin

###Model:
 - item
 - admin
 - vote

###Sequence Flow:

normal:
 1. signin
 2. browse vote/questionaire(unfinish)

admin:
 1. login
 2. browse user information (online/offline)
 3. operate user information (CRUD)

or
 1. login
 2. create item by admin (only the creater can see)
 3. create vote by admin(only the creater can see)
 4. add item into vote
 5. operate the item in vote (CRUD)

###Framework
 - sails.js

###Database
 - MongoBD

thank ~ star ~
