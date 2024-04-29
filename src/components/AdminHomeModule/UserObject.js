import React from 'react';
import { Container, Sprite, Text } from "@inlet/react-pixi";
import { TextStyle } from "@pixi/text";
import RectButton from '../RectButton'; 
import UserManagementModule from '../../components/AdminHomeModule/UserManagementModule'
import { changeUserRoleInDatabase, getUserNameFromDatabase } from '../../firebase/userDatabase'

import { green, neonGreen, black, blue, white, pink, orange, red, transparent, turquoise } from "../../utils/colors";

let currentUsername = null; // set currentUsername to null so that while the promise in getUserName() is pending, getUserName() returns null
async function getUserName(){
    const promise = getUserNameFromDatabase();

    // Wait for the promise to resolve and get the username
    currentUsername = await promise;
    return currentUsername; // return the username of the current user
}

const UserObject = (props) => {
    const { width, height, x, y, username, index, role, userId, refreshUserListCallback } = props;

    const UserPermissions = {
        Admin: 'Admin',
        Developer: 'Developer',
        Teacher: 'Teacher',
        Student: 'Student',
    };

    const roleColors = {
        [UserPermissions.Admin]: red,
        [UserPermissions.Developer]: orange,
        [UserPermissions.Teacher]: blue,
        [UserPermissions.Student]: green,
    };

    // Define the order of roles
    const roleOrder = [UserPermissions.Admin, UserPermissions.Developer, UserPermissions.Teacher, UserPermissions.Student];

    // Function to get the next role
    const getNextRole = (currentRole) => {
        const currentIndex = roleOrder.indexOf(currentRole);
        const nextIndex = (currentIndex + 1) % roleOrder.length; // Cycle through roles
        return roleOrder[nextIndex];
    };

    // Function to handle role change
    const handleChangeRole = async () => {
        try {
            const result = await changeUserRoleInDatabase(userId, getNextRole(role));

            if (result) {
                // Success
                // Change the color of the button
                // Update the list of users
                await refreshUserListCallback();
                console.log("User role changed successfully.");
            } else {
                // Failure
                console.log("Failed to change user role.");
            }
        } catch (error) {
            // Handle any errors that occurred during the operation
            console.error("Error:", error);
            alert("An error occurred while changing the user role.");
        }
    };

    return (
        <>
            <Text
                x={width * 1.1}
                y={y * 1.1 + height *0.25}  // Move this line inside the style object
                text={username} //username
                style={
                    new TextStyle({
                        fontFamily: 'Futura',
                        fontSize: height/5.5,
                        fontWeight: height*4,
                    })
                }
            />
            {/* Render the Role Button only if the user is not the current user */}
             
                <RectButton
                    height={55}
                    width={200}
                    x={width * 5}
                    y={y * 1.1 + height *0.25}
                    color={roleColors[role]}
                    fontSize={15}
                    fontColor={white}
                    text={role}
                    fontWeight={800}
                    callback={() => {
                        getUserName();
                        if(username != currentUsername && currentUsername != null){ // users cannot change their own role
                            console.log("username:", username, " currentUsername:", currentUsername);
                            handleChangeRole();
                        }
                    }}
                />
        
        </>
    );
};

export default UserObject;
