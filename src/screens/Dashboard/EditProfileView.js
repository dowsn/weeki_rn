import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';

const EditProfileView = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleNameChange = (text) => {
    setName(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Name:', name);
    console.log('Email:', email);
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={handleNameChange}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={handleEmailChange}
      />
      <Button title="Save" onPress={handleSubmit} />
    </View>
  );
};

export default EditProfileView;