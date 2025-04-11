'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {useState} from 'react';

interface Task {
  description: string;
  metaTags: string[];
  participantLimit: number;
  participants: number;
}

export default function Home() {
  const [taskDescription, setTaskDescription] = useState('');
  const [metaTags, setMetaTags] = useState(['', '', '', '', '']);
  const [participantLimit, setParticipantLimit] = useState(5);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleCreateTask = () => {
    const newTask = {
      description: taskDescription,
      metaTags: metaTags.filter(tag => tag !== ''),
      participantLimit: participantLimit,
      participants: 0,
    };

    setTasks([...tasks, newTask]);
    setTaskDescription('');
    setMetaTags(['', '', '', '', '']);
    setParticipantLimit(5); // Reset to default
  };

  const handleJoinTask = (index: number) => {
    const updatedTasks = [...tasks];
    if (updatedTasks[index].participants < updatedTasks[index].participantLimit) {
      updatedTasks[index].participants += 1;
      setTasks(updatedTasks);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create a Task</CardTitle>
          <CardDescription>Enter the task details to share with others.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="taskDescription">Task Description</Label>
            <Textarea
              id="taskDescription"
              value={taskDescription}
              onChange={e => setTaskDescription(e.target.value)}
              placeholder="Describe the task..."
            />
          </div>

          <div className="grid gap-2">
            <Label>Meta Tags (up to 5)</Label>
            {metaTags.map((tag, index) => (
              <Input
                key={index}
                type="text"
                value={tag}
                onChange={e => {
                  const newMetaTags = [...metaTags];
                  newMetaTags[index] = e.target.value;
                  setMetaTags(newMetaTags);
                }}
                placeholder={`Meta Tag ${index + 1}`}
              />
            ))}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="participantLimit">Participant Limit</Label>
            <Input
              type="number"
              id="participantLimit"
              value={participantLimit}
              onChange={e => setParticipantLimit(parseInt(e.target.value))}
              min="1"
              placeholder="Enter participant limit"
            />
          </div>

          <Button onClick={handleCreateTask}>Create Task</Button>
        </CardContent>
      </Card>

      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Available Tasks</h2>
        <div className="grid gap-4">
          {tasks.map((task, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{`Task ${index + 1}`}</CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Meta Tags: {task.metaTags.join(', ')}</p>
                <p>
                  Participants: {task.participants} / {task.participantLimit}
                </p>
                <Button
                  onClick={() => handleJoinTask(index)}
                  disabled={task.participants >= task.participantLimit}
                >
                  {task.participants >= task.participantLimit ? 'Task Full' : 'Join Task'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
