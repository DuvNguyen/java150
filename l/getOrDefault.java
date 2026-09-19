package l;

import java.util.HashMap;
import java.util.Map;

public class getOrDefault {
    public static void main(String[] args) {
        Map<Integer, Integer> map = new HashMap<>();

        map.put(3, 3);
        map.put(3, map.getOrDefault(3, 0));

        System.out.println(map);

    }
}