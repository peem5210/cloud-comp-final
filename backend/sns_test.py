from sns_wrapper import SnsWrapper
sns_wrapper = SnsWrapper()

phone_number='+66847702836'
message = 'Sawaddee kub'

sns_wrapper.send_message_to_phone(phone_number, message)

