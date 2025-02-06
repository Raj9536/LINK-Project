import React, { useState } from 'react';
import {
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  Box,
  Avatar,
  IconButton,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  Group as GroupIcon,
  Person as PersonIcon,
  Send as SendIcon,
  Add as AddIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiEmotionsIcon,
} from '@mui/icons-material';

const drawerWidth = 300;

const theme = createTheme({
  palette: {
    primary: {
      main: '#E0115F',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        },
        indicator: {
          backgroundColor: '#E0115F',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#E0115F',
            fontWeight: 'bold',
          },
        },
      },
    },
  },
});

const groups = [
  { id: '1', name: 'Project A Team', lastMessage: 'Meeting at 3 PM', isGroup: true, avatar: '/placeholder.svg?height=40&width=40' },
  { id: '2', name: 'Family', lastMessage: 'Dinner plans?', isGroup: true, avatar: '/placeholder.svg?height=40&width=40' },
  { id: '3', name: 'Book Club', lastMessage: 'Next book: 1984', isGroup: true, avatar: '/placeholder.svg?height=40&width=40' },
];

const people = [
  { id: '4', name: 'Alice Johnson', lastMessage: 'Hey, how are you?', isGroup: false, avatar: '/placeholder.svg?height=40&width=40' },
  { id: '5', name: 'Bob Smith', lastMessage: 'Can you send me the report?', isGroup: false, avatar: '/placeholder.svg?height=40&width=40' },
  { id: '6', name: 'Carol White', lastMessage: 'Lunch tomorrow?', isGroup: false, avatar: '/placeholder.svg?height=40&width=40' },
];

function ChatComponent() {
  const [selectedTab, setSelectedTab] = useState('groups');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // Store messages for the selected chat
  const [isTyping, setIsTyping] = useState(false); // State for typing indicator

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'user' }]);
      setMessage('');
      setIsTyping(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    setIsTyping(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="h6" noWrap>
              Chat
            </Typography>
          </Box>

          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            sx={{ '& .MuiTab-root': { minWidth: 0, flex: 1 } }}
          >
            <Tab label="Groups" value="groups" />
            <Tab label="People" value="people" />
          </Tabs>

          {selectedTab === 'groups' && (
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => console.log('Make Group clicked')}
              >
                Make Group
              </Button>
            </Box>
          )}

          <List sx={{ overflow: 'auto', flexGrow: 1, py: 0 }}>
            {(selectedTab === 'groups' ? groups : people).map((item) => (
              <ListItem
                button
                key={item.id}
                onClick={() => {
                  setSelectedChat(item);
                  setMessages([]); // Clear messages when switching chats
                }}
                selected={selectedChat?.id === item.id}
                sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Avatar src={item.avatar} alt={item.name}>
                    {item.isGroup ? <GroupIcon /> : <PersonIcon />}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  secondary={item.lastMessage}
                  primaryTypographyProps={{ noWrap: true }}
                  secondaryTypographyProps={{ noWrap: true }}
                  sx={{
                    '& .MuiListItemText-primary, & .MuiListItemText-secondary': {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Chat Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {selectedChat ? (
            <>
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', alignItems: 'center' }}>
                <Avatar src={selectedChat.avatar} alt={selectedChat.name} sx={{ mr: 2 }}>
                  {selectedChat.isGroup ? <GroupIcon /> : <PersonIcon />}
                </Avatar>
                <Typography variant="h6">{selectedChat.name}</Typography>
              </Box>

              <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column' }}>
                {messages.length === 0 && (
                  <Typography variant="body2" color="textSecondary" align="center">
                    No messages yet. Start the conversation!
                  </Typography>
                )}

                {messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.100',
                      color: msg.sender === 'user' ? 'primary.contrastText' : 'inherit',
                      p: 1,
                      borderRadius: 1,
                      maxWidth: '70%',
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                  </Box>
                ))}

                {isTyping && (
                  <Typography variant="caption" color="textSecondary" sx={{ alignSelf: 'flex-start' }}>
                    Typing...
                  </Typography>
                )}
              </Box>

              <Box sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', alignItems: 'center' }}>
                <IconButton size="small" sx={{ mr: 1 }}>
                  <AttachFileIcon />
                </IconButton>
                <IconButton size="small" sx={{ mr: 1 }}>
                  <EmojiEmotionsIcon />
                </IconButton>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message..."
                  value={message}
                  onChange={handleTyping}
                  sx={{ mr: 1 }}
                />
                <Button variant="contained" color="primary" endIcon={<SendIcon />} onClick={handleSend}>
                  Send
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h6">Select a chat to start messaging</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default ChatComponent;
