import React, {useState} from 'react';
import {useStripe, useElements, PaymentElement, CardElement} from '@stripe/react-stripe-js';
import axios from 'axios';

const SetupForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);

  const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message);
  }

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    // Trigger form validation and wallet collection
    const {error: submitError} = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }



    // Create the PaymentMethod using the details collected by the Payment Element
   stripe.createPaymentMethod({
    elements,
      params: {
        billing_details: {
          name: 'Jenny Rosen',
        }
      }
    })
    .then(result => console.log(result))

    // await axios.post('')

    // Now that you have a PaymentMethod, you can use it in the following steps to render a confirmation page or run additional validations on the server
  };
  return (
    <form className='w-full' onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={!stripe}>Submit</button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default SetupForm;