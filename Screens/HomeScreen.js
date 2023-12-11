import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Card from '../utilities/card'; // Import the Card component
import CustomHeader from '../utilities/navbar'; // Import the Card component

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <CustomHeader title="Home" showBackButton={false} />
            <View style={styles.row}>
                <Card style={styles.card} title="Payables" onPress={() => navigation.navigate('PayablesReceiveables', { eventType: 1, title: 'Payables' })} />
                <Card title="Receiveables" onPress={() => navigation.navigate('PayablesReceiveables', { eventType: 2, title: 'Receiveables' })} />
            </View>
            <View style={styles.row}>
                <Card title="Expenses" onPress={() => navigation.navigate('PayablesReceiveables', { eventType: 3, title: 'Expenses' })} />
                <Card title="Banks" onPress={() => navigation.navigate('PayablesReceiveables', { eventType: 4, title: 'Banks' })} />
            </View>
            <View style={styles.row}>
                <Card title="Cash Receive" onPress={() => navigation.navigate('Voucher', { eventType: 1, title: 'Cash Receive' })} />
                <Card title="Cash Pay" onPress={() => navigation.navigate('Voucher', { eventType: 2, title: 'Cash Pay' })} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: 'white', // Set a background color to match your design
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    card: {
        // fontSize: 'bold'
        fontWeight: '100'
    }
});

export default HomeScreen;