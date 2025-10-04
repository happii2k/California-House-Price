// DOM Elements
const form = document.getElementById('predictForm');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsCard = document.getElementById('resultsCard');
const resultStatus = document.getElementById('resultStatus');
const resultText = document.getElementById('resultText');
const errorText = document.getElementById('errorText');
const toast = document.getElementById('toast');
const spinner = submitBtn.querySelector('.spinner');
const btnLabel = submitBtn.querySelector('.btn-label');

// Form validation rules
const validationRules = {
  MedInc: { 
    required: true, 
    min: 0, 
    max: 50, 
    type: 'number',
    message: 'Please enter a valid median income (0-50)' 
  },
  HouseAge: { 
    required: true, 
    min: 0, 
    max: 100, 
    type: 'number',
    message: 'Please enter a valid house age (0-100 years)' 
  },
  AveRooms: { 
    required: true, 
    min: 0, 
    max: 50, 
    type: 'number',
    message: 'Please enter a valid average rooms (0-50)' 
  },
  AveBedrms: { 
    required: true, 
    min: 0, 
    max: 10, 
    type: 'number',
    message: 'Please enter a valid average bedrooms (0-10)' 
  },
  AveOccup: { 
    required: true, 
    min: 0, 
    max: 20, 
    type: 'number',
    message: 'Please enter a valid average occupancy (0-20)' 
  },
  Latitude: { 
    required: true, 
    min: -90, 
    max: 90, 
    type: 'number',
    message: 'Please enter a valid latitude (-90 to 90)' 
  },
  Longitude: { 
    required: true, 
    min: -180, 
    max: 180, 
    type: 'number',
    message: 'Please enter a valid longitude (-180 to 180)' 
  }
};

// State management
let formData = {};
let isSubmitting = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeForm();
  setupEventListeners();
  populateSampleData();
});

// Setup event listeners
function setupEventListeners() {
  // Form submission
  form.addEventListener('submit', handleFormSubmit);
  
  // Reset button
  resetBtn.addEventListener('click', handleFormReset);
  
  // Real-time validation
  const inputs = form.querySelectorAll('.form-control');
  inputs.forEach(input => {
    input.addEventListener('input', (e) => handleInputValidation(e.target));
    input.addEventListener('blur', (e) => handleInputValidation(e.target));
    input.addEventListener('focus', clearFieldError);
  });

  // Info icon tooltips for mobile
  const infoIcons = document.querySelectorAll('.info-icon');
  infoIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTooltipMobile(icon);
    });
  });

  // Close tooltips when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.info-icon')) {
      hideAllTooltips();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
}

// Initialize form with sample data
function populateSampleData() {
  const sampleData = {
    MedInc: '5.5',
    HouseAge: '10',
    AveRooms: '6.2',
    AveBedrms: '1.1',
    AveOccup: '3.2',
    Latitude: '34.05',
    Longitude: '-118.25'
  };

  Object.keys(sampleData).forEach(key => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) {
      input.value = sampleData[key];
      handleInputValidation(input);
    }
  });
}

// Initialize form
function initializeForm() {
  // Reset form state
  formData = {};
  isSubmitting = false;
  
  // Hide results initially
  resultsCard.classList.add('hidden');
  
  // Set initial status
  updateResultStatus('info', 'Enter property details above to get a price prediction');
}

// Mock prediction function (simulates Flask backend)
function mockPrediction(formInputs) {
  // Simple linear model simulation based on California housing patterns
  const medInc = parseFloat(formInputs.MedInc);
  const houseAge = parseFloat(formInputs.HouseAge);
  const aveRooms = parseFloat(formInputs.AveRooms);
  const aveBedrms = parseFloat(formInputs.AveBedrms);
  const aveOccup = parseFloat(formInputs.AveOccup);
  const latitude = parseFloat(formInputs.Latitude);
  const longitude = parseFloat(formInputs.Longitude);
  
  // Simplified prediction algorithm inspired by California housing data
  let basePrice = 1.5; // Base price in hundreds of thousands
  
  // Income has strong positive correlation
  basePrice += medInc * 0.4;
  
  // Age generally decreases value
  basePrice -= houseAge * 0.005;
  
  // More rooms generally increase value
  basePrice += (aveRooms - 4) * 0.1;
  
  // Bedroom ratio affects value
  const bedroomRatio = aveBedrms / aveRooms;
  if (bedroomRatio > 0.3) basePrice -= 0.2; // Too many bedrooms relative to total rooms
  
  // Occupancy affects value (overcrowding reduces price)
  if (aveOccup > 4) basePrice -= (aveOccup - 4) * 0.05;
  
  // Location premium (California coast areas)
  if (latitude >= 32 && latitude <= 42 && longitude >= -125 && longitude <= -114) {
    // Coastal California premium
    if (longitude >= -122) basePrice += 1.0; // Near coast
    if (latitude >= 37 && latitude <= 38 && longitude >= -122.5) basePrice += 1.5; // Bay Area
    if (latitude >= 33.5 && latitude <= 34.5 && longitude >= -118.5) basePrice += 0.8; // LA area
  }
  
  // Add some realistic variance
  const variance = (Math.random() - 0.5) * 0.2;
  basePrice += variance;
  
  // Ensure minimum realistic price
  basePrice = Math.max(basePrice, 0.5);
  
  return basePrice;
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (isSubmitting) return;
  
  // Validate all fields first
  const isValid = validateAllFields();
  if (!isValid) {
    showToast('Please fix the errors above', 'error');
    return;
  }
  
  // Show loading state
  setLoadingState(true);
  
  try {
    // Collect form data
    const formDataObj = new FormData(form);
    const formInputs = {};
    
    // Convert FormData to object
    for (let [key, value] of formDataObj.entries()) {
      formInputs[key] = value;
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Try to connect to Flask backend first, fallback to mock
    let prediction;
    let usingMock = false;
    
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        body: formDataObj,
        timeout: 3000
      });
      
      if (response.ok) {
        const responseText = await response.text();
        const predictionMatch = responseText.match(/Predicted House Price: ([\d,.]+)/);
        
        if (predictionMatch) {
          prediction = parseFloat(predictionMatch[1]);
        } else {
          throw new Error('Invalid backend response');
        }
      } else {
        throw new Error('Backend not available');
      }
    } catch (backendError) {
      // Use mock prediction when backend is unavailable
      usingMock = true;
      prediction = mockPrediction(formInputs);
    }
    
    // Display success with appropriate message
    displaySuccess(prediction, usingMock);
    
    const message = usingMock 
      ? 'Prediction completed (using demo model)' 
      : 'Prediction completed successfully!';
    showToast(message, 'success');
    
  } catch (error) {
    console.error('Prediction error:', error);
    displayError(error.message);
    showToast(`Error: ${error.message}`, 'error');
  } finally {
    setLoadingState(false);
  }
}

// Handle form reset
function handleFormReset() {
  // Reset form
  form.reset();
  
  // Clear all validation states
  const inputs = form.querySelectorAll('.form-control');
  inputs.forEach(input => {
    input.classList.remove('error', 'success');
    clearFieldError(input);
  });
  
  // Hide results
  resultsCard.classList.add('hidden');
  
  // Repopulate with sample data
  setTimeout(() => {
    populateSampleData();
    updateResultStatus('info', 'Enter property details above to get a price prediction');
  }, 100);
  
  showToast('Form reset to default values', 'success');
}

// Validate all form fields
function validateAllFields() {
  let isValid = true;
  const inputs = form.querySelectorAll('.form-control');
  
  inputs.forEach(input => {
    const fieldValid = handleInputValidation(input);
    if (!fieldValid) {
      isValid = false;
      // Add shake animation
      const formGroup = input.closest('[data-field]');
      if (formGroup) {
        formGroup.classList.add('shake');
        setTimeout(() => formGroup.classList.remove('shake'), 400);
      }
    }
  });
  
  return isValid;
}

// Handle input validation
function handleInputValidation(input) {
  const fieldName = input.name;
  const value = input.value.trim();
  const rules = validationRules[fieldName];
  
  if (!rules) return true;
  
  // Clear previous error state
  clearFieldError(input);
  
  // Check if field is required
  if (rules.required && !value) {
    showFieldError(input, `${getFieldLabel(fieldName)} is required`);
    return false;
  }
  
  // Skip further validation if field is empty and not required
  if (!value) return true;
  
  // Number validation
  if (rules.type === 'number') {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      showFieldError(input, `${getFieldLabel(fieldName)} must be a valid number`);
      return false;
    }
    
    if (rules.min !== undefined && numValue < rules.min) {
      showFieldError(input, `${getFieldLabel(fieldName)} must be at least ${rules.min}`);
      return false;
    }
    
    if (rules.max !== undefined && numValue > rules.max) {
      showFieldError(input, `${getFieldLabel(fieldName)} must be no more than ${rules.max}`);
      return false;
    }
  }
  
  // Show success state
  input.classList.add('success');
  return true;
}

// Get field label for error messages
function getFieldLabel(fieldName) {
  const labels = {
    MedInc: 'Median Income',
    HouseAge: 'House Age',
    AveRooms: 'Average Rooms',
    AveBedrms: 'Average Bedrooms',
    AveOccup: 'Average Occupancy',
    Latitude: 'Latitude',
    Longitude: 'Longitude'
  };
  return labels[fieldName] || fieldName;
}

// Show field error
function showFieldError(input, message) {
  input.classList.add('error');
  input.classList.remove('success');
  
  const errorElement = input.closest('.form-group').querySelector('.error-message');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
  }
}

// Clear field error
function clearFieldError(input) {
  if (typeof input === 'object' && input.target) {
    input = input.target;
  }
  
  input.classList.remove('error', 'success');
  
  const errorElement = input.closest('.form-group').querySelector('.error-message');
  if (errorElement) {
    errorElement.classList.remove('show');
    errorElement.textContent = '';
  }
}

// Set loading state
function setLoadingState(loading) {
  isSubmitting = loading;
  
  if (loading) {
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;
    spinner.classList.remove('hidden');
    btnLabel.textContent = 'Predicting...';
  } else {
    submitBtn.classList.remove('btn--loading');
    submitBtn.disabled = false;
    spinner.classList.add('hidden');
    btnLabel.textContent = 'Predict Price';
  }
}

// Display success result
function displaySuccess(price, usingMock = false) {
  resultsCard.classList.remove('hidden');
  errorText.classList.add('hidden');
  resultText.classList.remove('hidden');
  
  const formattedPrice = formatCurrency(price);
  const demoNote = usingMock ? ' (Demo Mode)' : '';
  resultText.textContent = `Estimated House Price: ${formattedPrice}${demoNote}`;
  
  const statusMessage = usingMock 
    ? 'Prediction completed using demo model' 
    : 'Prediction completed';
  updateResultStatus('success', statusMessage);
  
  // Smooth scroll to results
  setTimeout(() => {
    resultsCard.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }, 100);
}

// Display error result
function displayError(errorMessage) {
  resultsCard.classList.remove('hidden');
  resultText.classList.add('hidden');
  errorText.classList.remove('hidden');
  
  errorText.textContent = `Error: ${errorMessage}`;
  
  updateResultStatus('error', 'Prediction failed');
  
  // Smooth scroll to results
  setTimeout(() => {
    resultsCard.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }, 100);
}

// Update result status
function updateResultStatus(type, message) {
  resultStatus.className = `status status--${type} mb-8`;
  resultStatus.textContent = message;
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount * 100000); // Convert from hundreds of thousands to dollars
}

// Show toast notification
function showToast(message, type = 'info') {
  toast.textContent = message;
  toast.className = `toast toast--${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Toggle tooltip for mobile
function toggleTooltipMobile(icon) {
  const tooltip = icon.nextElementSibling;
  if (tooltip && tooltip.classList.contains('tooltip')) {
    // Toggle visibility
    const isVisible = tooltip.style.visibility === 'visible';
    hideAllTooltips();
    
    if (!isVisible) {
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = '1';
    }
  }
}

// Hide all tooltips
function hideAllTooltips() {
  const tooltips = document.querySelectorAll('.tooltip');
  tooltips.forEach(tooltip => {
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = '0';
  });
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
  // Close tooltips on Escape
  if (e.key === 'Escape') {
    hideAllTooltips();
  }
  
  // Submit on Ctrl+Enter
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    if (!isSubmitting) {
      handleFormSubmit(e);
    }
  }
}

// Error handling for uncaught errors
window.addEventListener('error', (e) => {
  console.error('Uncaught error:', e.error);
  showToast('An unexpected error occurred', 'error');
});

// Handle network errors
window.addEventListener('online', () => {
  showToast('Connection restored', 'success');
});

window.addEventListener('offline', () => {
  showToast('No internet connection', 'error');
});