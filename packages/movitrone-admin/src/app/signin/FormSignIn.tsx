'use client';
import { Form, Input } from 'antd';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { UserValidation } from '@/validations/auth';
import { Button } from 'antd';
import { useSignInMutation } from '@/services/APIs/AuthApi';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import FormItem from '@/lib/FormItem';
import { getError } from '@/Helpers/getError';
import { setCookie } from 'cookies-next';

interface FormDataProps {
  email: string;
  password: string;
}
const FormSignIn: FC = ({}) => {
  const { mutateAsync, isPending } = useSignInMutation();
  const { reset, control, handleSubmit } = useForm<FormDataProps>({
    resolver: joiResolver(UserValidation.loginSchema),
  });
  const SubmitSignIn = async (formData: FormDataProps) => {
    const { email, password } = formData;
    await mutateAsync({ email, password })
      .then((res) => {
        signIn('credentials', {
          email,
          password,
        });
        setCookie('access_token', res.access_token);
        reset();
      })
      .catch((error: any) => {
        console.log(error);
        toast.error(getError(error));
      });
  };
  const Items = [{ name: 'email' }, { name: 'password' }];
  return (
    <Form onFinish={handleSubmit(SubmitSignIn)} layout='vertical'>
      <div>
        {Items.map((item) => (
          <FormItem
            key={item.name}
            control={control}
            label={<p className='text-xs uppercase'>{`your ${item.name}`}</p>}
            name={item.name as keyof FormDataProps}
          >
            <Input
              type={item.name}
              size='large'
              placeholder={`Enter your ${
                item.name.charAt(0).toUpperCase() +
                item.name.slice(1).toLowerCase()
              } ...`}
              variant='filled'
              className='form-input'
            />
          </FormItem>
        ))}
      </div>

      <Button
        htmlType='submit'
        type='primary'
        className='my-3 w-full'
        disabled={isPending}
        loading={isPending}
      >
        Sign In
      </Button>
    </Form>
  );
};

export default FormSignIn;
