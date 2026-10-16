# 삼류검가 소가주는 전생이 천마

25화 무협소설 웹 독서 사이트와 EPUB 전자책.

사이트: https://bear2u.github.io/chunma-novel-web/

## 기능

- 모바일 독서 화면, 고정 글자 크기 도구와 이전 화·목차·다음 화
- 밝게·종이색·어둡게 3가지 테마
- 글자 크기와 테마 저장, 읽던 회차·위치 이어 읽기
- 1~25화 EPUB 다운로드

## 배포

GitHub Actions는 `dist/`의 완성된 정적 사이트를 검사한 뒤 GitHub Pages에 배포합니다. DOC/DOCX 원본, 기획안과 로드맵은 이 저장소에 포함하지 않습니다. 사이트를 읽는 데 필요한 회차 HTML과 EPUB은 포함합니다.

`main` 또는 `master` 브랜치에 push하면 자동 배포됩니다. 저장소의 Settings → Pages → Source는 GitHub Actions로 설정합니다.

## 로컬 실행

```sh
python3 scripts/check_site.py
python3 -m http.server 8767 --directory dist
```

http://localhost:8767 에서 확인합니다. EPUB은 `dist/cheonma-vol-1.epub`입니다.

## 업데이트

원고 수정·사이트 생성은 원본을 보관한 로컬 작업 폴더에서 실행합니다. 변환한 `dist/` 파일만 이 저장소에 반영합니다. 저장소에는 원본 문서를 올리지 않습니다.

```sh
# 원본 작업 폴더에서 사이트 재생성
python3 scripts/build.py
python3 scripts/check_site.py
# 생성 결과만 선택하여 업로드
# dist는 로컬 작업 폴더에서 ignore되므로 -f 사용
git add -f dist/
git commit -m "Update published novel"
git push
```

`build.py`는 원고와 함께 로컬에 보관하는 생성 도구로, 이 배포 전용 저장소에는 포함하지 않습니다. 웹 테마는 EPUB 앱의 테마 설정과 별개입니다.
