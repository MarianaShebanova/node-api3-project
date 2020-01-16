const express = require('express');

const Users = require('./userDb.js');
const Posts = require('../posts/postDb');

const router = express.Router();
////////////////////////////////////////////
router.post('/', validateUser, (req, res) => {
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

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const post = req.body;

  Posts.insert(post)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: 'sorry, we ran into an error creating the post',
      });
    });
});
////////////////////////////////////////////

router.get('/', (req, res) => {
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

router.get('/:id', validateUserId, (req, res) => {
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

router.get('/:id/posts', validateUserId, (req, res) => {
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

router.delete('/:id', validateUserId, (req, res) => {
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

router.put('/:id', validateUser, validateUserId, (req, res) => {
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

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(data => {
      if (!data) {
       return res.status(400).json({
          errorMessage: "invalid user id"
        });
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "The user information could not be retrieved."
      });
    })
  next();
}

function validateUser(req, res, next) {
  const changes = req.body;
  if (!changes || !changes.name) {
    return res.status(400).json({ errorMessage: 'missing required name field' });
  }
  next();
}

function validatePost(req, res, next) {
  const { id: user_id } = req.params;
  const { text } = req.body;

  if (!req.body || !text) {
    return res.status(400).json({ errorMessage: 'Post requiers text' });
  }
  next(); 
}

module.exports = router;