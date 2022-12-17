# Monkey Radio Global API

[monkeyradio.fr](monkeyradio.fr) private module

In production at : [api.monkeyradio.fr](api.monkeyradio.fr)

---

This module provide a full REST API wich contains all the monkey radio public data !

### INSTALL

* Clone this repo in any directory
* Install all npm modules

  ```
  npm install
  ```
* Create config files (from example file)

```
cp config/dbConfig.mjs.example config/dbConfig.mjs
```

    And fill it with your personal specs

### DEPLOY

You have 2 choices to deploy this app :

* Recommended method with **PM2**
* Basic method with **systemd**
