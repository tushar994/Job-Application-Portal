# Job Application Portal

## About

This is a job portal that allows companies to register and create job listsings, and allows applicants to apply to the jobs of the companies. It allows companies to view the applicants along with their information, and has tons moew features.

## Installations

### Node

- For Linux:

```
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
sudo apt-get install -y nodejs
```

- For Mac:

```
brew install node
```

### MongoDB

Install the community edition [here](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials).

### React

```
npm install -g create-react-app
```

## Running the boilerplate

- Run Mongo daemon:

```
sudo mongod
```

- for mac

```
sudo brew services start mongodb-community
```

Mongo will be running on port 27017.

- Run Express Backend:

```
cd backend/
npm install
npm start
```

- Run React Frontend:

```
cd frontend
npm install/
npm start
```

Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser.
