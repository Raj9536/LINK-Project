import React from "react";
import { Box, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import Sentiment from "sentiment";  // Import the sentiment library

const SentimentAnalysis = ({ userComment }) => {
  let commentArr = [];
  userComment?.comments?.forEach((comment) => {
    commentArr.push(comment?.description);
  });

  const [sentimentData, setSentimentData] = React.useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });

  // Initialize Sentiment instance
  const sentimentAnalyzer = new Sentiment();

  // Function to analyze sentiment using the sentiment library
  const analyzeSentiment = (comment) => {
    const result = sentimentAnalyzer.analyze(comment);
    if (result.score > 0) {
      return "positive";
    } else if (result.score < 0) {
      return "negative";
    } else {
      return "neutral";
    }
  };

  // Function to calculate sentiment data from userComment
  const calculateSentimentData = () => {
    const initialSentimentData = { positive: 0, negative: 0, neutral: 0 };

    commentArr.forEach((comment) => {
      const sentiment = analyzeSentiment(comment);
      initialSentimentData[sentiment] += 1;
    });

    return initialSentimentData;
  };

  React.useEffect(() => {
    const updatedSentimentData = calculateSentimentData();
    setSentimentData(updatedSentimentData);
  }, [commentArr?.length]);

  // Calculate the total number of comments and sentiment percentages
  const totalComments = commentArr.length;
  const positivePercentage =
    totalComments > 0
      ? ((sentimentData.positive / totalComments) * 100).toFixed(1)
      : 0;
  const negativePercentage =
    totalComments > 0
      ? ((sentimentData.negative / totalComments) * 100).toFixed(1)
      : 0;
  const neutralPercentage =
    totalComments > 0
      ? ((sentimentData.neutral / totalComments) * 100).toFixed(1)
      : 0;

  // Prepare data for Doughnut chart with percentage labels
  const chartData = {
    labels: [
      `Positive (${positivePercentage}%)`,
      `Negative (${negativePercentage}%)`,
      `Neutral (${neutralPercentage}%)`,
    ],
    datasets: [
      {
        data: [
          sentimentData.positive,
          sentimentData.negative,
          sentimentData.neutral,
        ],
        backgroundColor: ["#4caf50", "#f44336", "#ffeb3b"],
        hoverBackgroundColor: ["#66bb6a", "#e57373", "#fff176"],
      },
    ],
  };

  return (
    <Box
      sx={{
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Sentiment Analysis
      </Typography>
      <Typography variant="body1" gutterBottom>
        Analyze sentiments based on comments.
      </Typography>

      {/* Flexbox container to adjust the layout */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {/* Right: Chart Section */}
        <Box sx={{ width: "100%", display: "flex" }}>
          <Box sx={{ height: "300px", width: "100%" }}>
            <Doughnut data={chartData} />
          </Box>

          {/* Sentiment Breakdown Below the Chart */}
          <Box sx={{ marginTop: "5.5rem", textAlign: "left" }}>
            <Typography variant="body2">
              Positive Comments: {sentimentData.positive} ({positivePercentage}
              %)
            </Typography>
            <Typography variant="body2">
              Negative Comments: {sentimentData.negative} ({negativePercentage}
              %)
            </Typography>
            <Typography variant="body2">
              Neutral Comments: {sentimentData.neutral} ({neutralPercentage}%)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SentimentAnalysis;
