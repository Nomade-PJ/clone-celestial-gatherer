// Utility functions for handling trash bin functionality

// Key for storing deleted customers in localStorage
const DELETED_CUSTOMERS_KEY = 'pauloCell_deleted_customers';

// Function to move a customer to trash
export const moveCustomerToTrash = (customerId: string) => {
  try {
    // Get current customers
    const savedCustomers = localStorage.getItem('pauloCell_customers');
    if (!savedCustomers) return false;
    
    const customers = JSON.parse(savedCustomers);
    const customerToDelete = customers.find((c: any) => c.id === customerId);
    
    if (!customerToDelete) return false;
    
    // Remove from active customers
    const updatedCustomers = customers.filter((c: any) => c.id !== customerId);
    localStorage.setItem('pauloCell_customers', JSON.stringify(updatedCustomers));
    
    // Add to deleted customers
    const savedDeletedCustomers = localStorage.getItem(DELETED_CUSTOMERS_KEY);
    const deletedCustomers = savedDeletedCustomers ? JSON.parse(savedDeletedCustomers) : [];
    
    deletedCustomers.push({
      ...customerToDelete,
      deletedAt: new Date().toISOString()
    });
    
    localStorage.setItem(DELETED_CUSTOMERS_KEY, JSON.stringify(deletedCustomers));
    return true;
  } catch (error) {
    console.error('Error moving customer to trash:', error);
    return false;
  }
};

// Function to restore a customer from trash
export const restoreCustomerFromTrash = (customerId: string) => {
  try {
    // Get deleted customers
    const savedDeletedCustomers = localStorage.getItem(DELETED_CUSTOMERS_KEY);
    if (!savedDeletedCustomers) return false;
    
    const deletedCustomers = JSON.parse(savedDeletedCustomers);
    const customerToRestore = deletedCustomers.find((c: any) => c.id === customerId);
    
    if (!customerToRestore) return false;
    
    // Remove deletedAt property
    const { deletedAt, ...customerData } = customerToRestore;
    
    // Add back to active customers
    const savedCustomers = localStorage.getItem('pauloCell_customers');
    const customers = savedCustomers ? JSON.parse(savedCustomers) : [];
    customers.push(customerData);
    localStorage.setItem('pauloCell_customers', JSON.stringify(customers));
    
    // Remove from deleted customers
    const updatedDeletedCustomers = deletedCustomers.filter((c: any) => c.id !== customerId);
    localStorage.setItem(DELETED_CUSTOMERS_KEY, JSON.stringify(updatedDeletedCustomers));
    
    return true;
  } catch (error) {
    console.error('Error restoring customer from trash:', error);
    return false;
  }
};

// Function to permanently delete a customer
export const permanentlyDeleteCustomer = (customerId: string) => {
  try {
    const savedDeletedCustomers = localStorage.getItem(DELETED_CUSTOMERS_KEY);
    if (!savedDeletedCustomers) return false;
    
    const deletedCustomers = JSON.parse(savedDeletedCustomers);
    const updatedDeletedCustomers = deletedCustomers.filter((c: any) => c.id !== customerId);
    
    localStorage.setItem(DELETED_CUSTOMERS_KEY, JSON.stringify(updatedDeletedCustomers));
    return true;
  } catch (error) {
    console.error('Error permanently deleting customer:', error);
    return false;
  }
};

// Function to get all deleted customers
export const getDeletedCustomers = () => {
  try {
    const savedDeletedCustomers = localStorage.getItem(DELETED_CUSTOMERS_KEY);
    return savedDeletedCustomers ? JSON.parse(savedDeletedCustomers) : [];
  } catch (error) {
    console.error('Error getting deleted customers:', error);
    return [];
  }
};