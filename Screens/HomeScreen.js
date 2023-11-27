import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Card from '../utilities/card'; // Import the Card component

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Card title="Payables" onPress={() => navigation.navigate('PayablesReceiveables', { eventType: 1 })} />
                <Card title="Receiveables" onPress={() => navigation.navigate('PayablesReceiveables', { eventType: 2 })} />
            </View>
            <View style={styles.row}>
                <Card title="Cash Receive" onPress={() => navigation.navigate('Voucher', { eventType: 1 })} />
                <Card title="Cash Pay" onPress={() => navigation.navigate('Voucher', { eventType: 2 })} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: StatusBar.currentHeight
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    }
});

export default HomeScreen;