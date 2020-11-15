[![Build Status](https://travis-ci.org/dat3startcode/rest-jpa-devops-startcode.svg?branch=master)](https://travis-ci.org/dat3startcode/rest-jpa-devops-startcode)

# CA3 Frontend Project
## How to use
Our website is a SPA using react and bootstrap. The project consists of compontents which can be accesed through the navigation bar, these components uses react router. The website also have login/logout feature, where we use localstorage to handle the jwt-token. Our apiFacade.js is a generic handler for our fetch functions. This way we can fetch our backend URL's and set certain request headers, such as POST/GET using a universal makeOptions function. Finally our Settings.js file, which contains all the  URL's for fetching combined in one file. This way if we want to fetch from a different URL, we dont have to find it some random file. 
