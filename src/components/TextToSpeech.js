import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import './TextToSpeech.css';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [language, setLanguage] = useState('en-US');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleConvert = async () => {
    try {
      let voiceName;
      switch (language) {
        case 'ar-XA':
          voiceName = 'ar-XA-Wavenet-A';
          break;
        case 'fr-FR':
          voiceName = 'fr-FR-Wavenet-D';
          break;
        default:
          voiceName = 'en-US-Wavenet-D';
      }

      const response = await axios.post(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=YOUR_GOOGLE_CLOUD_TEXTTOSPEECH_API_KEY`,
        {
          input: { text },
          voice: { languageCode: language, name: voiceName },
          audioConfig: { audioEncoding: 'MP3' },
        }
      );

      const audioContent = response.data.audioContent;
      const audioUrl = `data:audio/mp3;base64,${audioContent}`;
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'audio.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Enter a text to convert it to speech
      </Typography>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Type something here..."
        rows={4}
        cols={50}
      />
      <Box mt={2}>
        <FormControl fullWidth>
          <InputLabel className="select-container" id="language-label">Language</InputLabel>
          <Select
            labelId="language-label"
            value={language}
            onChange={handleLanguageChange}
          >
            <MenuItem value="en-US">English (US)</MenuItem>
            <MenuItem value="ar-XA">Arabic</MenuItem>
            <MenuItem value="fr-FR">French</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleConvert}>
          Convert
        </Button>
      </Box>
      {audioUrl && (
        <div className="audio-container">
          <audio controls src={audioUrl} />
          <br />
          <Button variant="contained" color="primary" onClick={handleDownload}>
            Download Audio
          </Button>
        </div>
      )}
    </Container>
  );
};

export default TextToSpeech;
