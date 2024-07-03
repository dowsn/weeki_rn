// import React, { useContext, useEffect, useState } from 'react';
// import { UserContext } from '../contexts/UserContext';
// import fetchFromApi from '../utilities/api';

// export const usePickLists = () => {
//   const [user, setUser] = useContext(UserContext);
//   const [pickLists, setPickLists] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setLoading] = useState(false);



//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const data = await fetchFromApi('getPickListsForCityID', {
//           user_id: user.userId,
//           city_id: user.selectedCityId,
//         });
//         setPickLists(data.listitems);
//         if (data.listitems.length > 0) {
//           setUser((prevUser) => ({
//             ...prevUser,
//             selectedPickList: data.listitems[0].id,
//           }));
//         }
//       } catch (error) {
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return [pickLists, isLoading, error];
// };
