import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {Link} from "react-router-dom";
import RLink from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  dragAndDrop: {
    border: 'dotted',
    height: 200,
    maxWidth: 500,
    margin: 'auto',
    borderRadius: 25
  },
  noLinkDefault: {
    textDecoration: 'none'
  }
}));

function CustomLink(props) {
  const classes = useStyles();
  return <Link to={props.to}>
    <RLink variant={props.variant}>
      {props.value}
    </RLink>
  </Link>
}

export default function VerticalLinearStepper() {
  const classes = useStyles();

  const [temp, setTemp] = useState(0);

  const forceUpdate = () => {
    setTemp((temp) => temp + 1);
  }

  const getActiveStep = () => {
    let res = localStorage.getItem("step");
    if (res == null)
      return 0;
    return parseInt(res);
  };

  const setActiveStep = (stepID) => {
    localStorage.setItem("step", stepID);
    forceUpdate();
  };

  const handleNext = () => {
    setActiveStep(getActiveStep() + 1);
  };

  const handleBack = () => {
    setActiveStep(getActiveStep() - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const stepHeader = [
    [0, "Training Data Upload"],
    [1, "Model Training"],
    [2, "Prediction Data Upload"],
    [3, "Download segmented images"]
  ];

  const stepContent = [
    <Typography>
      The first step is to upload a training data set.<br/>
      <CustomLink to="/data" value="Go to the Data View"/>
    </Typography>,
    <Typography>
      Now, it's time to create a model using the existing training data set.<br/>
      <CustomLink to="/model" value="Go to the Model View"/>
    </Typography>,
    <Typography>
      In order to make a prediction using the created model, you need to first upload a prediction data set in
      the <CustomLink to="/data" value="Data View"/>, and then go to the <CustomLink to="/model" value="Model View"/> to
      select a model and click run.
    </Typography>,
    <Typography>
      You can check all the tasks in our system using the <CustomLink to="/task" value="Task View"/> view, and after the
      prediction is done, we can go back to our <CustomLink to="/data" value="Data View"/> to analyze and download the result.
    </Typography>
  ];

  return (
    <div>
      <Typography variant="h4">Wizard</Typography>
      <Stepper activeStep={getActiveStep()} orientation="vertical" align="center">
        {
          stepHeader.map((step) => <Step key={step[0]}>
              <StepLabel>{step[1]}</StepLabel>
              <StepContent>
                {stepContent[step[0]]}
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={getActiveStep() === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      {step[0] >= stepHeader.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          )
        }
      </Stepper>
      {getActiveStep() === stepHeader.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>
            All steps completed, you&apos;re finished. <RLink onClick={handleReset}>Click here to restart!</RLink>
          </Typography>
        </Paper>
      )}
    </div>
  );
}
