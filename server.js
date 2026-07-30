const express = require("express");
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./openapi.json")


const app = express();
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))




const tasks = [
    {
        id: 1,
        title: "Learn Express",
        done: false
    },
    {
        id: 2,
        title: "Build todo API",
        done: false
    },
    {
        id: 3,
        title: "Learn CRUD",
        done: true
    }
]

app.get("/", (req, res) => {
    res.json({
        "name": "Task API",
        "version": "1.0",
        "endpoints": ["/tasks"]
    });
});

app.get("/health", (req, res) => {
    res.json({
        "status": "OK"
    });
});

app.get("/tasks", (req, res) => {
    res.json(tasks);
})

app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id)
    const task = tasks.find((task) => {
        return task.id === id
    });
    if(!task){
        return res.status(404).json({
            "error": `Task ${id} not found`
        });
    }

    res.json(task);
})

app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required"
        });
    }

    const newTask = {
        id: tasks.length + 1,
        title: title,
        done: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});



app.put("/tasks/:id", (req, res) => {
    const { title, done } = req.body;
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if(!task){
        return res.status(404).json({
            message: `Task with id ${id} is not found`
        });
    }

    if(title === undefined && done === undefined){
        return res.status(400).json({
            message: "Provide title or done to update the task"
        });
    }

    if(title !== undefined){
        task.title = title;
    }

    if(done !== undefined){
        task.done = done;
    }

    res.status(200).json(task);
});

app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id)
    const task = tasks.find(task => task.id === id)
    if(!task){
        return res.status(404).json({
            message: "Task not found"
        });
    }
    
    const index = tasks.findIndex(task => task.id === id)
    tasks.splice(index, 1)

    res.status(200).send()
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});