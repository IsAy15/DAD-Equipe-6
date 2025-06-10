const baseUrl = 'http://localhost:3001/user-service/users';

module.exports = {
    getAllUsers: async (req, res) => {
        try{
            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const users = await response.json();
            res.status(200).json(users);

        }catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    
    getUserById: async (req, res) => {
        try{
            const id = req.params.id;
            if (!id) {
                return res.status(400).send('User ID is required');
            }

            const response = await fetch(`${baseUrl}/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const user = await response.json();
            res.status(200).json(user);
        }catch (error) {
            console.error(`Error fetching user with ID ${req.params.id}:`, error);
            res.status(500).send('Internal Server Error');
        }
    },
    createUser: async (req, res) => {
        try{
            //TODO Check if the request body contains the necessary fields

            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req.body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newUser = await response.json();
            res.status(201).json(newUser);
        }
        catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send('Internal Server Error');
        }
    },
    updateUser: async (req, res) => {
       try{
            const id = req.params.id;
            if (!id) {
                return res.status(400).send('User ID is required');
            }

            //TODO Check if the request body contains the necessary fields

            const response = await fetch(`${baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req.body)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedUser = await response.json();
            res.status(200).json(updatedUser);
       }
       catch (error) {
            console.error(`Error updating user with ID ${req.params.id}:`, error);
            res.status(500).send('Internal Server Error');
        }
    },
    deleteUser: async (req, res) => {
        try{
            const id = req.params.id;
            if (!id) {
                return res.status(400).send('User ID is required');
            }

            const response = await fetch(`${baseUrl}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            res.status(204).send(); // No content
        }catch (error) {
            console.error(`Error deleting user with ID ${req.params.id}:`, error);
            res.status(500).send('Internal Server Error');
        }
    }
};