/*
1. Tạo class Student với name, age, gpa. Đảm bảo gpa luôn trong [0.0, 4.0]. Nếu ai set gpa < 0 hoặc > 4.0 → throw IllegalArgumentException.
2. Tạo class Temperature với field celsius (private). Cung cấp getter getCelsius(), getFahrenheit(), getKelvin(). Chỉ có setter setCelsius()
— tự động tính các đơn vị còn lại.
3. Giải thích tại sao String trong Java là immutable (không có setter) — đây cũng là một dạng Encapsulation cực đoan.
*/



public class Student {
    private String name;
    private int age;
    private double gpa;

    public void setGpa(double gpa) {
        if(0.0 > gpa || gpa > 4.0) {
            throw new IllegalArgumentException("gpa should not be less than 0 or greater than 4");
        }
        this.gpa = gpa;
    }

    public void nameSetter(String name) {
        this.name = name;
    }

    public String nameGetter() {
        return this.name;
    }

     public void ageSetter(int age) {
        this.age= age;
    }

    public int ageGetter() {
        return this.age;
    }
    
     public void gpaSetter(double gpa) {
        this.gpa = gpa;
    }

    public double gpaGetter() {
        return this.gpa;
    }

    public Student(String name, int age, double gpa) {
        this.name = name;
        this.age = age;
        setGpa(gpa);
    }
}
