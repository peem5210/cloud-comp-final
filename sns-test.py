from sns_wrapper import SnsWrapper
sns_wrapper = SnsWrapper()

phone_number='+66813496565'
message = 'Sawaddee kub mae'

sns_wrapper.send_message_to_phone(phone_number, message)