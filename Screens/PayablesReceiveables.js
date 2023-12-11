import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../api/auth-service/auth-service';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, TextInput, Button } from 'react-native';
import CustomHeader from '../utilities/navbar';
import { defaultValues } from '../utilities/Constants/constant';

const PayablesReceiveables = ({ route }) => {
    const [data, setData] = useState([]); // State to store your data
    const [configList, setConfigList] = useState([]); // State to store your data
    const [subcategoryId, setSubcategory] = useState(0); // State to store your data
    const [searchQuery, setSearchQuery] = useState('');

    // Set eventType once when route.params changes
    const eventType = route.params?.eventType || 0;

    useEffect(() => {
        getConfigData();
    }, [route.params]);

    useEffect(() => {
        // After setting configList, check the subcategory
        if (configList.length > 0 && eventType) {
            const subcategory = configList.find(e =>
                eventType === 1 ? e.ColumnName === "Creditors" : eventType === 2 ? e.ColumnName === "Debtors" : eventType === 3 ? e.ColumnName === "Expense" : e.ColumnName === "Banks"
            )?.PostingAccountId ?? 0;

            setSubcategory(subcategory);
        }
    }, [configList, eventType]);

    useEffect(() => {
        // Fetch data once subcategoryId is set
        if (subcategoryId) {
            fetchData();
        }
    }, [subcategoryId]);

    const renderHeader = () => {
        return (
            <>
                <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                    placeholder="Search Posting Account"
                    autoFocus={true}
                />
                {/* <FontAwesome name="search" size={24} color="black" /> */}
            </>
        );
    };

    const getConfigData = async () => {
        try {
            const token = AuthService.getUser().Token; // Get the JWT token from AuthService

            const response = await fetch(`${defaultValues.baseUrl}/Accounts/GetConfigurationList?OrgId=${AuthService.getUser().OrgId}&BranchId=${AuthService.getUser().BranchId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add the Bearer token to the Authorization header
                },
            });

            if (!response.ok) {
                throw new Error('API call failed with status ' + response.status);
            }

            const configData = await response.json();
            setConfigList(configData);
        } catch (error) {
            console.error('Error fetching config data:', error);
        }
    };

    const fetchData = async () => {
        try {
            const token = AuthService.getUser().Token; // Get the JWT token from AuthService
            const response = await fetch(`${defaultValues.baseUrl}/Accounts/PartyBalances`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    BranchId: AuthService.getUser().BranchId,
                    OrgId: AuthService.getUser().OrgId,
                    SubcategoryId: subcategoryId,
                }),
            });

            if (!response.ok) {
                throw new Error('API call failed with status ' + response.status);
            }

            const fetchData = await response.json();
            setData(fetchData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const ListItem = ({ title, balance }) => (
        <View style={styles.itemContainer}>
            <View style={styles.iconAndText}>
                {/* <View style={styles.icon} /> */}
                <Ionicons style={{ marginRight: 5 }} name="person-sharp" size={20} color="gray" />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{title}</Text>
                </View>
            </View>
            <Text style={styles.followButtonText}>{balance}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <CustomHeader title={route.params?.title} showBackButton={true} />
            <FlatList
                data={data.filter(item =>
                    item.PostingAccountName.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                ListHeaderComponent={renderHeader}

                StickyHeaderComponent={renderHeader}
                keyExtractor={(item) => item.PostingAccountId.toString()}
                renderItem={({ item }) => (
                    <ListItem
                        title={item.PostingAccountName}
                        balance={item.ClosingBalance}
                    />
                )}
                keyboardShouldPersistTaps="always" // This prop prevents keyboard from closing
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20, // Space at the top to prevent overlap with the header
        marginTop: StatusBar.currentHeight
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderBlockColor: 'lightgray'
    },
    iconAndText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#aaa', // This should be the color of your icon
        marginRight: 10,
    },
    textContainer: {
        justifyContent: 'center',
    },
    title: {
        fontWeight: '300',
    },

    followButtonText: {

        fontWeight: 'bold',
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
        margin: 10,
        borderRadius: 5,
    },
});

export default PayablesReceiveables;