import db from "./FirestoreInit.js"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// 방명록 등록하기
export async function postComments(doc) {
    await addDoc(collection(db, "comments"), doc);
    alert('등록되었습니다!');
    window.location.reload();
}

// 방명록 목록 가져오기
export async function getCommentsList() {
    let docs = await getDocs(collection(db, "comments"));
    if (docs.size == 0) return;

    $('#commentsbox').show();

    let no = 0;
    docs.forEach((doc) => {
        // 버튼 구분 위해 숫자 붙여줌
        let docNo = ++no;

        // 수정, 삭제 위해 id 가져옴
        let docId = doc.id;

        let row = doc.data();
        let nickname = row['nickname'];
        let content = row['content'];
        let password = row['password'];

        let temp_html = `
        <div class="gallery-cell">
            <div class="nickname">${nickname}</div>
            <hr />
            <div id="content${docNo}" class="content">${content}</div>
            
            <div class="btnbox">
                <button id="confirmbtn${docNo}" type="button" class="btn btn-primary confirmbtn">확인</button>
                <button id="editingbtn${docNo}" type="button" class="btn btn-primary">수정</button>
                <button id="deletingbtn${docNo}" type="button" class="btn btn-secondary">삭제</button>
            </div>
        </div>
        `;

        //$('#commentsbox').append(temp_html);
        $('.gallery').append(temp_html);

        // 캐러셀 다시 초기화
        //$('#commentsbox').flickity('reloadCells');

        // 확인 버튼 숨김
        $('#confirmbtn' + docNo).hide();

        // 수정 버튼 클릭 이벤트
        $('#editingbtn' + docNo).click(async function () {
            editComments(docNo, docId, password);
        })

        // 삭제 버튼 클릭 이벤트
        $('#deletingbtn' + docNo).click(async function () {
            deleteComments(docId, password);
        })
    });
}

// 방명록 수정하기
async function editComments(docNo, docId, password) {
    let input = prompt('수정하시려면 비밀번호를 입력하세요.');
    if (input === password) {
        $('#content' + docNo).attr('contenteditable', 'true');
        $('#content' + docNo).css('border', '1px solid grey');

        $('#editingbtn' + docNo).hide();
        $('#confirmbtn' + docNo).show();

        // 확인 버튼 클릭 이벤트
        $('#confirmbtn' + docNo).click(async function () {
            const docRef = await doc(db, "comments", docId);
            await updateDoc(docRef, { content: $('#content' + docNo).text() });
            alert('수정되었습니다!');
            window.location.reload();
        })
    }
}

// 방명록 삭제하기
async function deleteComments(docId, password) {
    let input = prompt('삭제하시려면 비밀번호를 입력하세요.');
    if (input === password) {
        const docRef = await doc(db, "comments", docId);
        await deleteDoc(docRef);
        alert('삭제되었습니다!')
        window.location.reload();
    }
}