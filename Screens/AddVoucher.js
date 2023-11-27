import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text, Modal, FlatList, StatusBar } from 'react-native';
import axios from 'axios'; // if using Axios
import AuthService from '../api/auth-service/auth-service';

const AddVoucher = ({ route }) => {
    const [selectedOption, setSelectedOption] = useState(0);
    const [numberInput, setNumberInput] = useState(0);
    const [postingAccounts, setPostingAccounts] = useState([]);
    const [eventType, setEventType] = useState('');

    const [isPickerVisible, setPickerVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedOptionLabel, setSelectedOptionLabel] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {

        if (route.params?.eventType) {
            setEventType(route.params.eventType);
        }

        const userData = AuthService.getUser(); // Replace with the actual function to get user data
        setUser(userData);

        // Function to fetch posting accounts
        const fetchPostingAccounts = async () => {
            try {
                console.log(AuthService.getUser()?.OrgId);
                // Replace with your API endpoint
                const response = await axios.get(`https://xoftworld.com/Accounts/GetPostingAccountList?orgId=${AuthService.getUser()?.OrgId}`);
                const accounts = response.data.map(account => ({
                    label: account.PostingAccountName, // Adjust according to your API response
                    value: account.PostingAccountId,   // Adjust according to your API response
                }));
                setPostingAccounts(accounts);
            } catch (error) {
                console.error('Error fetching posting accounts:', error);
                Alert.alert("Error", "Failed to fetch posting accounts");
            }
        };

        fetchPostingAccounts();
    }, [route.params]);

    const renderPicker = () => {
        // Filter accounts based on search text
        const filteredAccounts = postingAccounts.filter(account =>
            account.label.toLowerCase().includes(searchText.toLowerCase())
        );

        return (
            <Modal
                visible={isPickerVisible}
                animationType="slide"
                onRequestClose={() => setPickerVisible(false)}
            >
                <TextInput
                    style={styles.searchInput}
                    onChangeText={setSearchText}
                    value={searchText}
                    placeholder="Search Accounts"
                />
                <FlatList
                    data={filteredAccounts}
                    keyExtractor={item => item.value.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelect(item)}>
                            <Text style={styles.listItem}>{item.label}</Text>
                        </TouchableOpacity>
                    )}
                />
            </Modal>
        );
    };

    const handleSelect = (item) => {
        setSelectedOption(item.value); // Update the selected value
        setSelectedOptionLabel(item.label); // Update the label for display
        setPickerVisible(false); // Close the picker modal
        setSearchText('');
    };

    const handleSubmit = async () => {
        if (numberInput > 0 && selectedOption > 0) {
            try {
                // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
                const response = await fetch('https://xoftworld.com/Accounts/AddVoucherTransaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Id: 0,
                        PostingAccountId: selectedOption,
                        VoucherDate: new Date().toISOString(),
                        Remarks: `Voucher Added by ${AuthService.getUser()?.UserName}`,
                        Amount: numberInput,
                        VoucherType: eventType,
                        BranchId: user.BranchId,
                        OrgId: user.OrgId,
                    }),
                });
                console.log(`acc :${selectedOption} \n ${numberInput}\n ${eventType}\n ${new Date().toISOString()}`);
                if (!response.ok) {
                    throw new Error('API call failed with status ' + response.status);
                }

                const data = await response.json();
                if (data) {
                    Alert.alert("Success", "Voucher added successfully!");
                    setSelectedOption(0);
                    setNumberInput(0);
                    setSelectedOption(0);
                    setSelectedOptionLabel('');
                } else {
                    Alert.alert("Success", "something went wrong please try add");
                    console.log(data)
                    setSelectedOption(0);
                    setNumberInput(0);
                    setSelectedOptionLabel('');
                }
            } catch (error) {
                console.error('Error during API call:', error);
                Alert.alert("Error", "Failed to add voucher");
            }
        } else {
            Alert.alert("Error", "Please enter Amount and also select person.");
            setSelectedOption(0);
            setNumberInput(0);
            setSelectedOptionLabel(null);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.pickerTrigger}>
                <Text>{selectedOptionLabel || "Select Account"}</Text>
                {/* You can add a down arrow icon here if needed */}
            </TouchableOpacity>

            {renderPicker()}
            <TextInput
                style={styles.input}
                onChangeText={setNumberInput}
                value={numberInput}
                placeholder="Enter a number"
                keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5', // You can adjust the background color
        marginTop: StatusBar.currentHeight
    },
    pickerTrigger: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // Additional styling...
    },
    input: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10, // Rounded corners
        backgroundColor: '#fff',
        color: 'black',
        width: '80%',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, marginTop: 10
    },
    buttonContainer: {
        width: '80%',
        borderRadius: 10, // Rounded corners
        overflow: 'hidden',
    },
    button: {
        backgroundColor: 'green', // Green color
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewContainer: {
        width: '80%', // Same as other inputs
        alignSelf: 'center', // Center align the picker
    },
    modalContent: {
        padding: 20,
        margin: 20, // Add some margin around the modal
        backgroundColor: 'white', // Background color for the modal content
        borderRadius: 10, // Rounded corners for the modal
        borderWidth: 1, // Border for the modal
        borderColor: 'gray', // Border color
        // Add shadow for 3D effect (optional)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    listItem: {
        padding: 12, // Increased padding for larger item size
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        fontSize: 18, // Increased text size
        // Additional styles if needed
    },
    searchInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10, // Rounded corners
        padding: 12, // Increased padding for larger size
        fontSize: 16, // Larger text size
        marginBottom: 20,
        width: '100%', // Adjust width as needed
        // Additional styles if needed
    },
});

export default AddVoucher;