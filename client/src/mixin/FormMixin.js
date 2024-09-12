
export default{
    data: () => ({
        rule: {
                required: [ v => !!v || "This field is required"],
                passwords: [
                    v => !!v || 'Password field is empty.',
                    v => v?.length > 3 || 'Password must be at least 3 characters.',
                  ],

            }
    })
}