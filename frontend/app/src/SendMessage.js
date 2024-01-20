import React, { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';


function SendMessage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState([]);
  const [isIssueDialogOpen, setIssueDialogOpen] = useState(false);


  useEffect(() => {
    fetch("http://localhost:8000/api/check_auth", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
    .then((response) => response.json())
    .then((data) => {
      if (!data.authenticated) {
        navigate("/login");
      }else{
        fetch("http://localhost:8000/api/get_company_user",{
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.success){
                setRecipients(data.data);
                setSelectedRecipients(data.data);
                setIssues(data.workbooks);
                setSelectedIssue([]);
                
            }else{
                console.log("Error:", data.error);
            }
        })
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }, [navigate]);

  const sendMessage = () => {
    const issueIds = selectedIssue.map(
      issue => `${issue.id}:${issue.name}`
    ).join(',');
    const recipientIds = selectedRecipients.map(
      user => `${user.id}:${user.username}`
    ).join(',');
    console.log(recipientIds);
    fetch("http://localhost:8000/api/send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(
            { 
                message,
                to: recipientIds,
                workbooks: issueIds,
            }
        ),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Message sent");
        setMessage("");
        setSelectedRecipients([]); 
        navigate("/mypage");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleRecipientToggle = (recipient) => {
    const currentIndex = selectedRecipients.indexOf(recipient);
    const newChecked = [...selectedRecipients];

    if (currentIndex === -1) {
      newChecked.push(recipient);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setSelectedRecipients(newChecked);
  };

  const handleIssueToggle = (issue) => {
    const currentIndex = selectedIssue.indexOf(issue);
    const newSelectedIssues = [...selectedIssue];
  
    if (currentIndex === -1) {
      newSelectedIssues.push(issue);
    } else {
      newSelectedIssues.splice(currentIndex, 1);
    }
  
    setSelectedIssue(newSelectedIssues);
  };  

  return (
    <>
      <UserHeader />
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > :not(style)': { m: 1 },
        }}
      >
        <Button variant="outlined" onClick={handleDialogOpen}>
          宛先を選択
        </Button>
        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>宛先を選択してください</DialogTitle>
          <DialogContent>
            <List>
              {recipients.map((recipient) => (
                <ListItem 
                  key={recipient.id} 
                  button 
                  onClick={() => handleRecipientToggle(recipient)}
                >
                  <Checkbox
                    checked={selectedRecipients.indexOf(recipient) !== -1}
                  />
                  <ListItemText primary={recipient.username} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>完了</Button>
          </DialogActions>
        </Dialog>
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                marginTop: 2,
                marginBottom: 2
            }}
        >
            {selectedRecipients.map((recipient) => (
                <Chip
                label={recipient.username}
                onDelete={() => handleRecipientToggle(recipient)}
                key={recipient.id}
                />
            ))}
        </Box>
        <Button variant="outlined" onClick={() => setIssueDialogOpen(true)}>
          問題を選択
        </Button>
        <Dialog open={isIssueDialogOpen} onClose={() => setIssueDialogOpen(false)}>
          <DialogTitle>問題を選択してください</DialogTitle>
          <DialogContent>
            <List>
              {issues.map((issue) => (
                <ListItem 
                  key={issue.id} 
                  button 
                  onClick={() => handleIssueToggle(issue)}
                >
                  <Checkbox
                    checked={selectedIssue.indexOf(issue) !== -1}
                  />
                  <ListItemText primary={issue.name} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIssueDialogOpen(false)}>完了</Button>
          </DialogActions>
      </Dialog>
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                marginTop: 2,
                marginBottom: 2
            }}
        >
            {selectedIssue.map((issue) => (
                <Chip
                label={issue.name}
                onDelete={() => handleIssueToggle(issue)}
                key={issue.id}
                />
            ))}
        </Box>
      </Box>
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          '& > :not(style)': { m: 1 },
        }}
      >
        <TextField
          label="メッセージ"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>
          送信
        </Button>
      </Box>
    </>
  );
}

export default SendMessage;