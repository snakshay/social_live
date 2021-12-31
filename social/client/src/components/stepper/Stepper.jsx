import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import UploadProfile from '../uploadProfile/UploadProfile';
import UploadCover from './../uploadCover/UploadCover';
import UserDetails from '../userDetails/userDetails';

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';

const steps = ['Upload Profile Picture', 'Upload Cover Picture', 'Provide Additonal Information'];

export default function GenericStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const navigate = useNavigate();

  const isStepOptional = (step) => {
   return true;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  
  useEffect(()=>{
    if(activeStep===3){
      localStorage.removeItem('firstLogin');
      navigate('/home')
    }
  },[activeStep,navigate])

  return (
    <Box sx={{ width: '100%' }} className='darkBackground'>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps} color={'white'}>
              <StepLabel {...labelProps}  ><span style={{ color: "white" }}>{label}</span></StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
         
        </>
      ) : (
        <>
          <Box sx={{ mt: 2, mb: 5 }} >

            {activeStep === 0 && <UploadProfile />}
            {activeStep === 1 && <UploadCover />}
            {activeStep === 2 && <UserDetails/>}
          </Box>
          <Box component="span" sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
