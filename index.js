const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

var app = express();

app.set("view engine", "ejs");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Enhanced items array with id, text, priority, and completed status
var items = [];
var nextId = 1;

// GET route - Display todos with optional priority filter
app.get("/", function(req, res) {
    let filteredItems = items;
    const priorityFilter = req.query.priority;
    
    if (priorityFilter && priorityFilter !== 'all') {
        filteredItems = items.filter(item => item.priority === priorityFilter);
    }
    
    res.render("list", { 
        ejes: filteredItems, 
        currentFilter: priorityFilter || 'all',
        allItems: items 
    });
});

// POST route - Add new todo
app.post("/", function(req, res) {
    const { ele1: text, priority } = req.body;
    
    // Server-side validation (backup for client-side validation)
    if (!text || text.trim() === '') {
        return res.redirect("/?error=empty");
    }
    
    const newItem = {
        id: nextId++,
        text: text.trim(),
        priority: priority || 'medium',
        completed: false
    };
    
    items.push(newItem);
    res.redirect("/");
});

// PUT route - Update todo (edit)
app.put("/edit/:id", function(req, res) {
    const id = parseInt(req.params.id);
    const { text, priority } = req.body;
    
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        if (text && text.trim() !== '') {
            items[itemIndex].text = text.trim();
        }
        if (priority) {
            items[itemIndex].priority = priority;
        }
    }
    
    res.redirect("/");
});

// PUT route - Toggle todo completion status
app.put("/toggle/:id", function(req, res) {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        items[itemIndex].completed = !items[itemIndex].completed;
    }
    
    res.redirect("/");
});

// DELETE route - Delete todo
app.delete("/delete/:id", function(req, res) {
    const id = parseInt(req.params.id);
    items = items.filter(item => item.id !== id);
    res.redirect("/");
});

app.listen(8000, function() {
    console.log("Server started on port 8000");
});