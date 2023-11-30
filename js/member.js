import db from "./FirestoreInit.js"
import { collection, doc, updateDoc ,getDocs, setDoc, query, where,deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


const memberRef = collection(db, "member");

export const setMember = async (data) => {
  try{
    await setDoc(doc(memberRef), data, { merge: true });
  }
  catch (e) {
    alert("데이터 저장에 실패하였습니다.");
    console.error(e);
  }
}

/**
 * 
 * @param {string} key 해당 Filed의 Key
 * @param {string} value 해당 Filed의 Value
 * @returns 성공시 Data 실패시 null
 */
export const getMember = async (key, value) => {
  const q = query(memberRef, where(key, "==", value))
  
  const result = {
    id: null,
    data: null,
  };
  const snap = await getDocs(q);
  snap.forEach((doc) => {
    result.id = doc.id;
    result.data = doc.data();
  })
  
  return result;
}

export const getAllMember = async () => {
  const result = [];
  const snap = await getDocs(memberRef);
  snap.forEach((doc) => {
    result.push(
      {
        id: doc.id,
        ...doc.data()
      }
    );
  })

  return result;
}

export const updateMember = async (id, data) => {
  console.log(id);
  console.log(data);
  id == null || id == undefined ? await setMember(data) :await updateDoc(doc(memberRef, id), data)
}

export const deleteMember = async (id) => {
  await deleteDoc(doc(db, "member", id))
}