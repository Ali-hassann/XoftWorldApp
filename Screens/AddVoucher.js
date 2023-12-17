import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, StyleSheet, Alert, TouchableOpacity, Text, Modal, FlatList, StatusBar } from 'react-native';
import AuthService from '../api/auth-service/auth-service';
import CustomHeader from '../utilities/navbar';
import { FontAwesome } from '@expo/vector-icons';
import { colors, defaultValues } from '../utilities/Constants/constant';
import Loader from '../utilities/loader';

const AddVoucher = ({ route }) => {
    const [selectedOption, setSelectedOption] = useState(0);
    const [numberInput, setNumberInput] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [postingAccounts, setPostingAccounts] = useState([]);
    const [eventType, setEventType] = useState('');

    const [isPickerVisible, setPickerVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedOptionLabel, setSelectedOptionLabel] = useState('');
    const [user, setUser] = useState(null);
    const [numberInputError, setNumberInputError] = useState('');
    const [selectedOptionError, setSelectedOptionError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if (route.params?.eventType) {
            setEventType(route.params.eventType);
        }

        const userData = AuthService.getUser(); // Replace with the actual function to get user data
        setUser(userData);
        const fetchPostingAccounts = async () => {
            try {
                const token = AuthService.getUser().Token; // Get the JWT token from AuthService

                const response = await fetch(`${defaultValues.baseUrl}/Accounts/GetPostingAccountList?orgId=${AuthService.getUser()?.OrgId}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`, // Add the Bearer token to the Authorization header
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`API call failed with status ${response.status}`);
                }

                const accounts = await response.json();

                setPostingAccounts(accounts.map(account => ({
                    label: account.PostingAccountName, // Adjust according to your API response
                    value: account.PostingAccountId, // Adjust according to your API response
                })));
            } catch (error) {
                console.error('Error fetching posting accounts:', error);
                Alert.alert("Error", "Failed to fetch posting accounts");
            }
        };
        fetchPostingAccounts();
    }, [route.params]);

    const loader = (value) => {
        setIsLoading(value);
    };

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
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.searchInput}
                        onChangeText={setSearchText}
                        value={searchText}
                        placeholder="Search Accounts"
                        placeholderTextColor="#A0A0A0"
                    />
                    <FlatList
                        data={filteredAccounts}
                        keyExtractor={item => item.value.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item)}>
                                <Text style={styles.listItemText}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        );
    };

    const handleSelect = (item) => {
        setSelectedOption(item.value); // Update the selected value
        setSelectedOptionLabel(item.label); // Update the label for display
        setPickerVisible(false); // Close the picker modal
        setSearchText('');
    };

    const validateInputs = () => {
        let isValid = true;

        if (numberInput == 0) {
            setNumberInputError('Amount must be greater then 0.');
            isValid = false;
        } else {
            setNumberInputError('');
        }

        if (selectedOption == 0) {
            setSelectedOptionError('Select an account');
            isValid = false;
        } else {
            setSelectedOptionError('');
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (validateInputs()) {
            try {
                loader(true);
                const token = AuthService.getUser().Token;
                // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
                const response = await fetch(`${defaultValues.baseUrl}/Accounts/AddVoucherTransaction`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        Id: 0,
                        PostingAccountId: selectedOption,
                        VoucherDate: new Date().toISOString(),
                        Remarks: remarks,
                        Amount: numberInput,
                        VoucherType: eventType,
                        BranchId: user.BranchId,
                        OrgId: user.OrgId,
                    }),
                });
                // console.log(`acc :${selectedOption} \n ${numberInput}\n ${eventType}\n ${new Date().toISOString()}`);
                if (!response.ok) {
                    loader(false);
                    throw new Error('API call failed with status ' + response.status);
                }

                const data = await response.json();
                if (data) {
                    loader(false);
                    Alert.alert("Success", "Voucher added successfully!");
                    setSelectedOption(0);
                    setNumberInput(0);
                    setSelectedOption(0);
                    setSelectedOptionLabel('');
                    setRemarks('');
                    broadcastMessage(`${route.params.eventType === 1 ? 'Payment' : 'Receipt'} voucher is generated.`, token);
                } else {
                    Alert.alert("Success", "something went wrong please try again");
                    console.log(data)
                    setSelectedOption(0);
                    setNumberInput(0);
                    setSelectedOptionLabel('');
                    setRemarks('');
                }
            } catch (error) {
                loader(false);
                console.error('Error during API call:', error);
                Alert.alert("Error", "Failed to add voucher");
            }
        } else {
            loader(false);
        }
    };

    const broadcastMessage = async (message, token) => {
        // console.log(message);
        await fetch(`${defaultValues.baseUrl}/Accounts/BroadCastMessage?message=${message}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    }

    return (
        <View >
            <View style={styles.container}>
                <CustomHeader title={route.params?.title} showBackButton={true} />

            </View>
            <View style={styles.mainContainer}>
                <ScrollView>

                    <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.pickerTrigger}>
                        <Text style={styles.pickerTriggerText}>{selectedOptionLabel || "Select Account"}</Text>
                        <FontAwesome name="caret-down" size={20} color={colors.dar} />
                    </TouchableOpacity>
                    {selectedOptionError ? <Text style={styles.errorText}>{selectedOptionError}</Text> : null}
                    {renderPicker()}

                    <TextInput
                        style={styles.input}
                        onChangeText={setNumberInput}
                        value={numberInput.toString()}
                        placeholder="Enter a number"
                        keyboardType="numeric"
                        placeholderTextColor="#A0A0A0"
                    />
                    {numberInputError ? <Text style={styles.errorText}>{numberInputError}</Text> : null}
                    <TextInput
                        style={styles.input}
                        onChangeText={setRemarks}
                        value={remarks}
                        placeholder="Enter a Remarks"
                        keyboardType="default"
                        placeholderTextColor="#A0A0A0"
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <Loader visible={isLoading} />
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: StatusBar.currentHeight,
        // backgroundColor: colors.neutral, // Light gray background color
        // alignItems: 'center', // Center content horizontally
        // paddingVertical: 20, // Add vertical padding
    },
    mainContainer: {
        // flex:1,
        width: '100%',
        paddingTop: 50,
        paddingHorizontal: 20,
        alignContent: 'center',
        // paddingTop: StatusBar.currentHeight,
        // backgroundColor: colors.neutral, // Light gray background color
        alignItems: 'center', // Center content horizontally
        // paddingVertical: 20, // Add vertical padding
        flexDirection: 'row'
    },
    pickerTrigger: {
        width: '100%',
        padding: 14,
        marginTopTop: 10,
        backgroundColor: colors.light, // Light background color
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row', // Align text and icon horizontally
        borderWidth: 1,
        borderColor: '#D1D1D1',
        shadowColor: colors.dar,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pickerTriggerText: {
        flex: 1, // Allow text to grow to the right
        color: colors.dar, // Black text color
    },
    errorText: {
        color: colors.danger,
        marginBottom: 10,
    },
    input: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: '#D1D1D1', // Light gray border color
        borderRadius: 10,
        backgroundColor: colors.light,
        color: colors.dar,
        width: '100%',
        // marginBottom: 20,
        shadowColor: colors.dar,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 20,
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
    },
    button: {
        backgroundColor: colors.primary,
        padding: 15,
        alignItems: 'center',
        shadowColor: colors.dar,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: colors.light,
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContent: {
        padding: 20,
        margin: 20,
        backgroundColor: colors.light,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D1D1D1',
        shadowColor: colors.dar,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    listItemText: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#D1D1D1',
        fontSize: 15,
        color: colors.dar,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#D1D1D1',
        borderRadius: 10,
        padding: 10,
        fontSize: 15,
        marginBottom: 20,
        width: '100%',
        color: colors.dar,
    },
});

export default AddVoucher;