const express = require('express');

const Users = require('./userDb.js');

const router = express.Router();
////////////////////////////////////////////
router.post('/', validateUser, logger, (req, res) => {
  const changes = req.body;

  Users.insert(changes)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: 'sorry, we ran into an error creating the user',
      });
    });
});
////////////////////////////////////////////

router.post('/:id/posts', (req, res) => {
  // do your magic!
});
////////////////////////////////////////////

router.get('/', logger, (req, res) => {
  Users.get() 
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: 'The users information could not be retrieved.',
      });
    });
});
////////////////////////////////////////////

router.get('/:id', validateUserId, logger, (req, res) => {
  const { id } = req.params;
  Users.getById(id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The user information could not be retrieved."
      });
    })
});
////////////////////////////////////////////

router.get('/:id/posts', validateUserId, logger, (req, res) => {
  const { id } = req.params;
  Users.getUserPosts(id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The posts information could not be retrieved."
      });
    })
});
////////////////////////////////////////////

router.delete('/:id', validateUserId, logger, (req, res) => {
  const id = req.params.id;

  Users.remove(id)
    .then(deleted => {
      res.status(200).json(deleted);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The user could not be removed"
      });
    });
});
////////////////////////////////////////////

router.put('/:id', validateUser, validateUserId, logger, (req, res) => {
  const changes = req.body;
  Users.update(req.params.id, changes)
        .then(user => {
          res.status(200).json(user);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: 'The user information could not be modified.',
            });
        });
});
////////////////////////////////////////////

//custom middleware

function logger(req, res, next) {
  const { method, originalUrl} = req;
  console.log(`[${new Date().toISOString()}] ${method} to ${originalUrl}`);
  next();
}

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(data => {
      if(!data) {
        res.status(400).json({
          errorMessage: "invalid user id"
        });
      } 
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: "The user information could not be retrieved."
      });
    })
  next();
}

function validateUser(req, res, next) {
  const changes = req.body;
  if (!changes || !changes.name) {
    res.status(400).json({ errorMessage: 'missing required name field' });
  }
  next();
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
