import React, {useState} from "react";
import InputMask from "react-input-mask";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"

const schema = yup
    .object({
        email: yup.string().required(),
    })

const formatNumber = str => {
    return parseInt(str.replace(/[^0-9]/g, ''));
}

function App() {

    const [data, setData] = useState([])

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = ({email, phone}) => {

        const number = formatNumber(phone)

        axios.post('/search', {email, number})
            .then(res => setData(res.data))
            .catch(function (error) {
                console.log(error);
            });
    }

    return (

      <main>
          <form onSubmit={handleSubmit(onSubmit)}>

              <input placeholder='email' {...register("email" )} />
              <p>{errors.email?.message}</p>

              <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                      <InputMask mask="999-999" {...field}>
                          {(inputProps) => <input {...inputProps} />}
                      </InputMask>
                  )}
              />

              <button type="submit">submit</button>
          </form>

          {

              data ? data?.map((user, i) => <p key={i}>{user.email} {user.number}</p>) : <p>not found</p>

          }
      </main>

  );
}

export default App;
