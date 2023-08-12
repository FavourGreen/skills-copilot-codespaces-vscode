// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
// Create express app
const app = express();
// Middleware
app.use(bodyParser.json());
// Enable cors
app.use(cors());
// Store comments
const commentsByPostId = {};
// Get comments by post id
app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});
// Create comment
app.post('/posts/:id/comments', async (req, res) => {
  // Generate id
  const commentId = randomBytes(4).toString('hex');
  // Get comment data
  const { content } = req.body;
  // Get post id
  const postId = req.params.id;
  // Get comments of post
  const comments = commentsByPostId[postId] || [];
  // Add new comment
  comments.push({ id: commentId, content, status: 'pending' });
  // Save comments
  commentsByPostId[postId] = comments;
  // Emit event
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: { id: commentId, content, postId, status: 'pending' },
  });
  // Send response
  res.status(201).send(comments);
});
// Handle events
app.post('/events', async (req, res) => {
  // Get event type
  const { type, data } = req.body;
  // Check if event type is CommentModerated
  if (type === 'CommentModerated') {
    // Get comment data
    const { id, postId, status, content } = data;
    // Get comments of post
    const comments = commentsByPostId[postId];
    // Find comment
    const comment = comments.find((comment) => comment.id === id);
    // Update comment
    comment.status = status;
    // Emit event
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { id, postId, status, content },
    });
  }
  // Send response
  res.send({});
});
// Listen on port 4001
app.listen
